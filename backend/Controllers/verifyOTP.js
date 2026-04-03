const user = require('../models/UserModels');
exports.verifyOtp= async (req,res)=>{
    try{
        const {email,otp} = req.body;

        const verifyuser = await user.findOne({email});
        if(!verifyuser){
            res.status(404).json({
                message:"email doesnot exist"
            })
        }
    }catch(error){

    }
}
