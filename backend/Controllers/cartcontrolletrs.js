const usermodel = require('../models/UserModels');
const productmodel = require('../models/ProductModels');
const cartmodel = require('../models/cartModel');

exports.AddToCart = async (req, res) => {
    try {
        const { productid, quantity } = req.body;
        const userId = req.user.id;

        const reqQuantity = Number(quantity);
        if (!reqQuantity || reqQuantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity kamti ma pani 1 huna parcha!"
            });
        }

        console.log("Searching for Product ID:", productid);
        const product = await productmodel.findById(productid.trim());

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "product vetiyana"
            });
        }

        if (product.stock === 0) {
            return res.status(400).json({
                success: false,
                message: "Yo product out of stock chha!"
            });
        }

        if (product.stock < reqQuantity) {
            return res.status(400).json({ 
                success: false, 
                message: "Stock ma yeti saman chhaina!" 
            });
        }

        const currentPrice = product.sellingPrice || product.actualPrice;

        let cart = await cartmodel.findOne({ user: userId });

        if (!cart) {
            cart = new cartmodel({
                user: userId,
                items: [{
                    product: productid.trim(),
                    quantity: reqQuantity,
                    price: currentPrice
                }]
            });
        } else {
            const isItemExist = cart.items.find(
                (item) => item.product.toString() === productid.trim()
            );

            if (isItemExist) {
                isItemExist.quantity += reqQuantity;
                isItemExist.price = currentPrice;
            } else {
                cart.items.push({
                    product: productid.trim(),
                    quantity: reqQuantity,
                    price: currentPrice
                });
            }
        }

        await cart.save();

        const updatedCart = await cartmodel.findOne({ user: userId }).populate({
            path: 'items.product',
            select: 'name actualPrice sellingPrice image stock'
        });

        res.status(200).json({
            success: true,
            message: "Cart updated successfully!",
            cart: updatedCart.items
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.GetCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await cartmodel.findOne({ user: userId }).populate({
            path: 'items.product',
            select: 'name actualPrice sellingPrice image stock'
        });

        if (!cart) {
            return res.status(200).json({
                success: true,
                count: 0,
                cart: []
            });
        }

        res.status(200).json({
            success: true,
            count: cart.items.length,
            cart: cart.items
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.RemoveFromCart = async (req, res) => {
    try {
        const { productid } = req.params;
        const userId = req.user.id;

        const cart = await cartmodel.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart bhetiyena" });
        }

        const initialLength = cart.items.length;
        
        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productid.trim()
        );

        if (cart.items.length === initialLength) {
            return res.status(404).json({ success: false, message: "Yo product cart ma chhaina" });
        }

        await cart.save();

        const updatedCart = await cartmodel.findOne({ user: userId }).populate({
            path: 'items.product',
            select: 'name actualPrice sellingPrice image stock'
        });

        res.status(200).json({
            success: true,
            message: "Product cart bata hatayo!",
            cart: updatedCart ? updatedCart.items : []
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.ClearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await cartmodel.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart bhetiyena" });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart purai khali vayo!",
            cart: []
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};