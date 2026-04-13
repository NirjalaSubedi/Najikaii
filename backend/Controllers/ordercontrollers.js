const Order = require('../models/OrderModels');
const User = require('../models/UserModels');
const Product = require('../models/ProductModels');

exports.PlaceOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { items, paymentMethod } = req.body; 

        let orderItems = [];
        let totalAmount = 0;
        let isCartOrder = false;

        if (items && items.length > 0) {
            for (const item of items) {
                const product = await Product.findById(item.product);
                if (!product) continue;

                const price = product.price * item.quantity;
                totalAmount += price;

                orderItems.push({
                    product: product._id,
                    quantity: item.quantity,
                    price: product.price
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
                const price = item.product.price * item.quantity;
                totalAmount += price;

                orderItems.push({
                    product: item.product._id,
                    quantity: item.quantity,
                    price: item.product.price
                });

                await Product.findByIdAndUpdate(item.product._id, {
                    $inc: { stock: -item.quantity }
                });
            }
        }

        // Commission Logic
        const adminCommission = totalAmount * 0.10;
        const vendorEarnings = totalAmount * 0.90;

        const newOrder = new Order({
            customer: userId,
            items: orderItems,
            totalAmount,
            adminCommission,
            vendorEarnings,
            paymentMethod: paymentMethod || 'COD'
        });

        await newOrder.save();

        // Cart khali garne (yedi cart bata order aako ho bhane matra)
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

exports.getorders = async(req,res)=>{
    try{
    

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}