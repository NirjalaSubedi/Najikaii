const usermodel = require('../models/UserModels');
exports.verifyOtp= async (req,res)=>{
    try{
        const {email,otp} = req.body;

        const user = await usermodel.findOne({email});
        if(!user){
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
        //if otp doesnot validate
        if(String(user.otp)!== String(otp)){
            return res.status(400).json({
                message:"invalid otp"
            })
        }
        //if otp is already expires
        if(user.otpExpire < Date.now()){
            return res.status(400).json({
                message:"otp already expired"
            })
        }
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpire = undefined;

        await user.save();

        return res.status(200).json({
            success:true,
            message:"otp validate success"
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
