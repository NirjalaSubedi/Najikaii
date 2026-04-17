const Order = require('../models/OrderModels');
const User = require('../models/UserModels');
const Product = require('../models/ProductModels');

//helper function ko calculate distance
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
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

                subTotal += product.price * item.quantity;
                
                if (!mainVendorId) mainVendorId = product.vendor;

                orderItems.push({
                    product: product._id,
                    quantity: item.quantity,
                    price: product.price,
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

                subTotal += item.product.price * item.quantity;
                if (!mainVendorId) mainVendorId = item.product.vendor;

                orderItems.push({
                    product: item.product._id,
                    quantity: item.quantity,
                    price: item.product.price,
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

        // 3. Financial Calculation
        const finalAmount = subTotal + dCharge;
        const adminCommission = subTotal * 0.10;
        const vendorEarnings = subTotal * 0.90;

        // 4. Order Create garne
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
            .populate('items.product', 'name price image');

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

        // 1. Stock Restore garne
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity }
            });
        }

        // 2. Status Update garne
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