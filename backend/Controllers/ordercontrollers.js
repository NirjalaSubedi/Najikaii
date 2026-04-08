const Order = require('../models/OrderModels');
const User = require('../models/UserModels');
const Product = require('../models/ProductModels');

exports.PlaceOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        // User ko cart populate garera tanne
        const user = await User.findById(userId).populate('cart.product');

        if (!user || user.cart.length === 0) {
            return res.status(400).json({ success: false, message: "Cart khali chha!" });
        }

        let totalAmount = 0;
        const orderItems = [];

        // Cart items lai order items format ma lane ra total calculate garne
        for (const item of user.cart) {
            const price = item.product.price * item.quantity;
            totalAmount += price;
            
            orderItems.push({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            });

            // Stock ghataune logic
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity }
            });
        }

        const adminCommission = totalAmount * 0.10;
        const vendorEarnings = totalAmount * 0.90;

        const newOrder = new Order({
            customer: userId,
            items: orderItems,
            totalAmount,
            adminCommission,
            vendorEarnings,
            paymentMethod: req.body.paymentMethod || 'COD'
        });

        await newOrder.save();

        user.cart = [];
        await user.save();

        res.status(201).json({
            success: true,
            message: "Order successfully rakhiyo!",
            order: newOrder
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};