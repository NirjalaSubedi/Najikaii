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
        //checking if user is already register or not
        if(user.isVerified){
            return res.status(400).json({
                message:"User is already verified"
            })
        }
        
    }catch(error){

    }
}
