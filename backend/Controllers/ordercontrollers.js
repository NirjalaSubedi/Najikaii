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
        const { items, paymentMethod,customerCoords } = req.body;

        let orderItems = [];
        let totalAmount = 0;
        let isCartOrder = false;

        if (items && items.length > 0) {
            for (const item of items) {
                const product = await Product.findById(item.product);
                
                if (!product) {
                    return res.status(404).json({ success: false, message: `Product ID ${item.product} valid chhaina!` });
                }

                if (product.stock < item.quantity) {
                    return res.status(400).json({ success: false, message: `${product.name} ko stock pugena!` });
                }

                const price = product.price * item.quantity;
                totalAmount += price;

                orderItems.push({
                    product: product._id,
                    quantity: item.quantity,
                    price: product.price,
                    vendor: product.vendor
                });

                // Stock update
                await Product.findByIdAndUpdate(product._id, {
                    $inc: { stock: -item.quantity }
                });
            }
        } 
        else {
            const user = await User.findById(userId).populate('cart.product');
            if (!user || user.cart.length === 0) {
                return res.status(400).json({ success: false, message: "Order garna items pathaunus wa cart use garnus!" });
            }

            isCartOrder = true;
            for (const item of user.cart) {
                if (!item.product) continue; 

                const price = item.product.price * item.quantity;
                totalAmount += price;

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

        const adminCommission = totalAmount * 0.10;
        const vendorEarnings = totalAmount * 0.90;

        const vendorData = await User.findById(vendorId);
        const vendorLoc = vendorData.location.coordinates;
        
        const distance = calculateDistance(
            customerCoords.lat, 
            customerCoords.lng, 
            vendorLoc[1], // vendor lattitude
            vendorLoc[0]  // vendor longittude
        );

        let dCharge = 0;
        if (distance <= 1) dCharge = 0;
        else if (distance <= 2) dCharge = 10;
        else if (distance <= 3) dCharge = 20;
        else if (distance <= 4) dCharge = 30;
        else if (distance <= 5) dCharge = 40;
        else dCharge = 50;

        const subTotal = products.reduce((acc, item) => acc + item.price, 0);
        const finalAmount = subTotal + dCharge;


        const newOrder = new Order({
            ...req.body,
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

        if (!order) return res.status(404).json({ success: false, message: "Order vettiyena!" });

        if (order.status === 'Delivered' || order.status === 'Cancelled') {
            return res.status(400).json({ success: false, message: "Yo order cancel garna mildaina!" });
        }

        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity }
            });
        }

        order.status = 'Cancelled';
        await order.save();

        res.status(200).json({ success: true, message: "Order cancel bhayo ani stock update bhayo!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};