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
        const product = await productmodel.findById(productid);
        if(!product){
            return res.status(404).json({
                success:false,
                message:"product vetiyana"
            })
        }
        
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}