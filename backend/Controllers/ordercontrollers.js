const Order = require('../models/OrderModels');
const User = require('../models/UserModels');
const Product = require('../models/ProductModels');

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

exports.PlaceOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { items, paymentMethod, customerCoords } = req.body;

        if (!customerCoords || !customerCoords.lat || !customerCoords.lng) {
            return res.status(400).json({ 
                success: false, 
                message: "Location access milena! Please latitude ra longitude pathaunu hos." 
            });
        }

        let orderItems = [];
        let subTotal = 0;
        let isCartOrder = false;
        let mainVendorId = null; 

        if (items && items.length > 0) {
            for (const item of items) {
                const product = await Product.findById(item.product);
                
                if (!product) {
                    return res.status(404).json({ success: false, message: `Product valid chhaina!` });
                }

                if (product.stock < item.quantity) {
                    return res.status(400).json({ success: false, message: `${product.name} ko stock pugena!` });
                }

                const unitPrice = Number(product.sellingPrice ?? product.actualPrice ?? 0);
                subTotal += unitPrice * item.quantity;
                
                if (!mainVendorId) mainVendorId = product.vendor;

                orderItems.push({
                    product: product._id,
                    quantity: item.quantity,
                    price: unitPrice,
                    vendor: product.vendor
                });

                await Product.findByIdAndUpdate(product._id, {
                    $inc: { stock: -item.quantity }
                });
            }
        } else {
            const user = await User.findById(userId).populate('cart.product');
            if (!user || user.cart.length === 0) {
                return res.status(400).json({ success: false, message: "Order garna items pathaunus wa cart use garnus!" });
            }

            isCartOrder = true;
            for (const item of user.cart) {
                if (!item.product) continue; 

                const unitPrice = Number(item.product.sellingPrice ?? item.product.actualPrice ?? 0);
                subTotal += unitPrice * item.quantity;
                if (!mainVendorId) mainVendorId = item.product.vendor;

                orderItems.push({
                    product: item.product._id,
                    quantity: item.quantity,
                    price: unitPrice,
                    vendor: item.product.vendor 
                });

                await Product.findByIdAndUpdate(item.product._id, {
                    $inc: { stock: -item.quantity }
                });
            }
        }

        if (orderItems.length === 0) {
            return res.status(400).json({ success: false, message: "Kunai pani valid items bhetiyena!" });
        }

        const vendorData = await User.findById(mainVendorId);
        if (!vendorData || !vendorData.location) {
            return res.status(400).json({ success: false, message: "Vendor ko location details bhetiyena!" });
        }

        const vendorLoc = vendorData.location.coordinates; // [lng, lat]
        const distance = calculateDistance(
            customerCoords.lat, 
            customerCoords.lng, 
            vendorLoc[1], // vendor latitude
            vendorLoc[0]  // vendor longitude
        );

        let dCharge = 0;
        if (distance <= 1) dCharge = 0;
        else if (distance <= 2) dCharge = 10;
        else if (distance <= 3) dCharge = 20;
        else if (distance <= 4) dCharge = 30;
        else if (distance <= 5) dCharge = 40;
        else dCharge = 50;

        //Financial Calculation
        const finalAmount = subTotal + dCharge;
        const adminCommission = subTotal * 0.10;
        const vendorEarnings = subTotal * 0.90;

        //Order Create garne
        const newOrder = new Order({
            customer: userId,
            items: orderItems,
            deliveryCharge: dCharge,
            subTotal: subTotal,
            totalAmount: finalAmount,
            adminCommission,
            vendorEarnings,
            paymentMethod: paymentMethod || 'COD'
        });

        await newOrder.save();

        if (isCartOrder) {
            await User.findByIdAndUpdate(userId, { $set: { cart: [] } });
        }

        res.status(201).json({
            success: true,
            message: "Order successfully rakhiyo!",
            order: newOrder
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.estimateOrder = async (req, res) => {
    try {
        const { productId, quantity = 1, customerCoords } = req.body;

        if (!productId) {
            return res.status(400).json({ success: false, message: "Product id pathaunus." });
        }

        if (!customerCoords || typeof customerCoords.lat !== 'number' || typeof customerCoords.lng !== 'number') {
            return res.status(400).json({ success: false, message: "Customer location valid chhaina." });
        }

        const productData = await Product.findById(productId).populate('vendor', 'name shopName location');

        if (!productData) {
            return res.status(404).json({ success: false, message: "Product bhetiyena." });
        }

        const vendorCoords = productData.vendor?.location?.coordinates;
        if (!Array.isArray(vendorCoords) || vendorCoords.length !== 2) {
            return res.status(400).json({ success: false, message: "Vendor location bhetiyena." });
        }

        const distance = calculateDistance(
            customerCoords.lat,
            customerCoords.lng,
            vendorCoords[1],
            vendorCoords[0]
        );

        let deliveryCharge = 0;
        if (distance <= 1) deliveryCharge = 0;
        else if (distance <= 2) deliveryCharge = 10;
        else if (distance <= 3) deliveryCharge = 20;
        else if (distance <= 4) deliveryCharge = 30;
        else if (distance <= 5) deliveryCharge = 40;
        else deliveryCharge = 50;

        const unitPrice = Number(productData.sellingPrice ?? productData.actualPrice ?? 0);
        const subTotal = unitPrice * Number(quantity || 1);
        const adminCommission = subTotal * 0.1;
        const totalAmount = subTotal + deliveryCharge;

        return res.status(200).json({
            success: true,
            product: {
                _id: productData._id,
                name: productData.name,
                image: productData.image,
                sellingPrice: productData.sellingPrice,
                actualPrice: productData.actualPrice,
                quantity: Number(quantity || 1),
                vendor: productData.vendor,
            },
            pricing: {
                distance,
                deliveryCharge,
                subTotal,
                adminCommission,
                totalAmount,
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.getorders = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role.toLowerCase();

        let query = {};

        if (userRole === 'admin') {
            query = {};
        } else if (userRole === 'customer') {
            query = { customer: userId };
        } else if (userRole === 'vendor') {
            // Pura order herne query
            query = { "items.vendor": userId };
        }

        let orders = await Order.find(query)
            .populate('customer', 'name email')
            .populate('items.product', 'name price image')
            .populate('items.vendor', 'name email shopName');

        if (userRole === 'vendor') {
            orders = orders.map(order => {
                const orderObj = order.toObject();
                orderObj.items = orderObj.items.filter(item => 
                    item.vendor.toString() === userId.toString()
                );
                
                orderObj.vendorSpecificTotal = orderObj.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
                
                return orderObj;
            });
        }

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.UpdateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role.toLowerCase(); 

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order vettiyena!" });
        }

        if (userRole === 'vendor') {
            const isOwner = order.items.some(item => item.vendor.toString() === userId.toString());
            
            if (!isOwner) {
                return res.status(403).json({ 
                    success: false, 
                    message: "Tapaile aru vendor ko order status update garna mil daina!" 
                });
            }
        }

        order.status = status;
        await order.save();

        res.status(200).json({ 
            success: true, 
            message: "Order status successfully update bhayo!", 
            order 
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.CancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order vettiyena!" });
        }

        const restrictedStatuses = ['Delivered', 'Confirmed', 'Cancelled'];
        
        if (restrictedStatuses.includes(order.status)) {
            return res.status(400).json({ 
                success: false, 
                message: `Yo order ko status '${order.status}' vayeko le garda cancel garna mildaina!` 
            });
        }

        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity }
            });
        }

        await Order.findByIdAndUpdate(orderId, { 
            $set: { status: 'Cancelled' } 
        });

        res.status(200).json({ 
            success: true, 
            message: "Order successfully cancel bhayo ani stock update bhayo!" 
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getOrderCount = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments({});
        
        // Calculate financial statistics from Delivered orders
        const deliveredOrders = await Order.find({ status: 'Delivered' });
        
        let totalRevenue = 0;
        let adminCommission = 0;
        let vendorPayouts = 0;
        
        deliveredOrders.forEach(order => {
            totalRevenue += (order.subTotal || 0);
            adminCommission += (order.adminCommission || (order.subTotal * 0.10));
            vendorPayouts += (order.vendorEarnings || (order.subTotal * 0.90));
        });

        console.log("FETCHED LIVE ORDERS COUNT:", totalOrders, "REVENUE:", totalRevenue);

        return res.status(200).json({
            success: true,
            totalOrders: totalOrders,
            totalRevenue: Math.round(totalRevenue),
            adminCommission: Math.round(adminCommission),
            vendorPayouts: Math.round(vendorPayouts)
        });
    } catch (error) {
        console.error("Order Analytics count failed:", error);
        return res.status(500).json({
            success: false,
            message: "Error counting multi-vendor platform orders",
            error: error.message
        });
    }
};

exports.getRecentOrders = async(req,res)=>{
    try{
        const recentorders = await Order.find({})
        .sort({ createdAt: -1 })
            .limit(4)    
            .populate('customer', 'name')
            .populate('items.product', 'name')
            .populate('items.vendor', 'name shopName');
        return res.status(200).json({
            success: true,
            orders: recentorders
        });

    }catch(error){
        res.status(500).json({
            success:false,
            message:"can't phase recent order",
            error:error.message
        })
    }
};

exports.getAdminCommissionStats = async (req, res) => {
    try {
        const deliveredOrders = await Order.find({ status: 'Delivered' })
            .populate('customer', 'name email')
            .populate('items.vendor', 'name email shopName')
            .sort({ createdAt: -1 });

        let totalRevenue = 0;
        let totalCommission = 0;
        let totalVendorPayouts = 0;

        const transactions = deliveredOrders.map(order => {
            const revenue = order.subTotal || 0;
            const commission = order.adminCommission || (revenue * 0.10);
            const vendorEarnings = order.vendorEarnings || (revenue * 0.90);

            totalRevenue += revenue;
            totalCommission += commission;
            totalVendorPayouts += vendorEarnings;

            // Get main vendor info
            const vendorNames = order.items.map(item => item.vendor?.shopName || item.vendor?.name || 'Local Vendor');
            const uniqueVendors = [...new Set(vendorNames)].join(', ');

            return {
                orderId: order._id,
                date: order.createdAt,
                customerName: order.customer?.name || 'Unknown Customer',
                vendorName: uniqueVendors,
                totalAmount: order.totalAmount,
                subTotal: revenue,
                commissionRate: 10,
                adminCommission: Math.round(commission),
                vendorEarnings: Math.round(vendorEarnings),
                paymentMethod: order.paymentMethod,
                status: order.status
            };
        });

        res.status(200).json({
            success: true,
            totalRevenue: Math.round(totalRevenue),
            totalCommission: Math.round(totalCommission),
            totalVendorPayouts: Math.round(totalVendorPayouts),
            averageCommission: transactions.length > 0 ? Math.round(totalCommission / transactions.length) : 0,
            transactions
        });
    } catch (error) {
        console.error("Admin commission stats fetch failed:", error);
        res.status(500).json({
            success: false,
            message: "Failed to load admin commission statistics",
            error: error.message
        });
    }
};