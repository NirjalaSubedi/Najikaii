const user=require('../models/UserModels');
const jwt = require('jsonwebtoken');
const bcryptjs= require('bcryptjs');
const crypto = require('crypto');
const sendEmail= require('../utils/sendEmail');
const { find } = require('../models/ProductModels');

exports.register=async(req,res)=>{
    try{
        const {name,email,password,role,PhoneNumber,Address}=req.body;
        //check if user alredy exist
        let existinguser = await user.findOne({email});
        if(existinguser){
             return res.status(400).json({
                message:"user already exist"
            })
        }

        //Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashpassword= await bcryptjs.hash(password,salt);

        //otp generating
        const otp= crypto.randomInt(100000,999999).toString();
        const otpExpire = Date.now() + 10 * 60 * 1000;

        //save user
        const newuser =new user({name,email,password:hashpassword,role,PhoneNumber,Address,otp,otpExpire,isVerified: false});
        await newuser.save();

        //sending email
        try {
            await sendEmail({
                email: newuser.email,
                subject: 'Najikai App - Email Verification Code',
                message: `Namaste ${name}, timro verification code ${otp} ho. Yo 10 minute pachi expire hunecha.`
            });

            res.status(201).json({
                success: true,
                message: "User registered! email ma aayeko OTP check garnuhos.",
                email: newuser.email
            });

        } catch (mailError) {
            if(newuser){
                await user.findByIdAndDelete(newuser.id)
            }
            console.log("Email error: ", mailError);
            return res.status(500).json({
                 message: "Email pathauna sakiyena." 
                });
        }

    }catch(e){
        res.status(500).json({
            error:e.message
        })

    }
}

exports.login= async (req,res)=>{
    try{
        const {email,password}=req.body;

        //find user
        const founduser = await user.findOne({email});
        if(!founduser){
            return res.status(404).json({
                message:"user is not register"
            })
        }

        //check password 
        const ismatch = await bcryptjs.compare(password,founduser.password);
        if(ismatch){

            if (!founduser.isVerified) {
                return res.status(401).json({ 
                message: "Please verify your email before logging in." 
                });
            }

        }

        //admin approval for vendor
        if (founduser.role === 'Vendor' && !founduser.isApproved) {
        return res.status(403).json({ 
            success: false,
            message: "Tapai ko account Admin le approve gareko chhaina. Kripaya parkhinuhos." 
        });
    }

        //create jwt token
        const token=jwt.sign({
            id:founduser._id,
            role:founduser.role
        },
        process.env.JWT_SECRET,
        {expiresIn:'1d'})

        res.status(200).json({
            success: true,
            token: token, 
            user: {
                id: founduser._id,
                name: founduser.name,
                role: founduser.role
            }
        });
    }catch(e){
        res.status(500).json({ message: e.message });
    }
}

//update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, PhoneNumber, Address } = req.body;
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: No user found in request" });
        }

        const userId = req.user.id; 
        // 1. User khojne ra update garne
        const updatedUser = await user.findByIdAndUpdate(
            userId,
            { name, PhoneNumber, Address },
            { new: true, runValidators: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User bhetiyena!" });
        }

        res.status(200).json({
            success: true,
            message: "Profile update bhayo!",
            user: updatedUser
        });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

//user delete garne logic
exports.deleteuser = async (req, res) => {
    try {
        const targetUserId = req.params.id; 
        const loggedInUser = req.user;    

        if (loggedInUser.role !== 'Admin' && loggedInUser.id !== targetUserId) {
            return res.status(403).json({
                success: false,
                message: "Tapaile aruko account delete garna paunu hunna!"
            });
        }

        const deletedUser = await user.findByIdAndDelete(targetUserId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User bhetiyena!" });
        }

        res.status(200).json({
            success: true,
            message: "Account delete bhayo!"
        });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

//display logedin user info
exports.GetMyProfileInfo= async (req,res)=>{
    try{
        const userid=req.user.id
        const userInfo= await user.findById(userid);

        if (!userInfo) {
            return res.status(404).json({
                success: false,
                message: "User bhetiyena"
            });
        }

        res.status(200).json({
            success:true,
            message:"success in fetching logedin user info",
            userInfo
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//display all user info in admin pannel
exports.getAllUserInfo = async (req,res)=>{
    try{
        if(req.user.role !== 'Admin'){
            return res.status(403).json({
                success:false,
                message:"all user display access admin saga matraii xa "
            })
        }
        const userinfo= await user.find({})
        res.status(200).json({
            success:true,
            data:userinfo
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//approve vendor garne logic 
exports.approveVendor = async (req, res) => {
    try {
        const { id } = req.params; 

        const updatedVendor = await user.findByIdAndUpdate(
            id, 
            { isApproved: true }, 
            { new: true }
        );

        if (!updatedVendor) {
            return res.status(404).json({ message: "Vendor bhetiyena!" });
        }

        res.status(200).json({
            success: true,
            message: `${updatedVendor.name} aba approved bhayo!`,
            data: updatedVendor
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};