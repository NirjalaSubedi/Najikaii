const usermodel = require('../models/UserModels');
const productmodel = require('../models/ProductModels');

//Add to cart logic
exports.AddToCart = async(req,res)=>{
    try{
        const {productid, quantity}= req.body;
        const userId= req.user.id;

        //check if user exist or not
        const user = await usermodel.findById(userId);
        if(!user){
            return res.status(404).json({
                success:false,
                message:"user vetiyana"
            })
        }

        //product exist garxa ki gardaiina check garne
        console.log("Searching for Product ID:", productid);
        const product = await productmodel.findById(productid.trim());
        //const product = await productmodel.findById(productid);
        if(!product){
            return res.status(404).json({
                success:false,
                message:"product vetiyana"
            })
        }

        //checking product stock
        if (product.stock < quantity) {
            return res.status(400).json({ message: "Stock ma yeti saman chhaina!" });
        }

        //checking if product already exist in cart or not
        const isItemExist = user.cart.find(
            (item) => item.product.toString() === productid
        );

        if (isItemExist) {
            isItemExist.quantity += Number(quantity);
        } else {
            user.cart.push({ product: productid, quantity });
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Cart updated successfully!",
            cart: user.cart
        });

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}