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
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}