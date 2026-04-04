const user=require('../models/UserModels');
const jwt = require('jsonwebtoken');
const bcryptjs= require('bcryptjs');
const crypto = require('crypto');
const sendEmail= require('../utils/sendEmail');

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
            console.log("Email error: ", mailError);
            return res.status(500).json({
                 message: "Email pathauna sakiyena, tara user create bhayo." 
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