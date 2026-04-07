const usermodel = require('../models/UserModels');
const productmodel = require('../models/ProductModels');

//Add to cart logic
exports.AddToCart = async(req,res)=>{
    try{

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}