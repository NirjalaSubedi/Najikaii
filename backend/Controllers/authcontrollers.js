const user=require('../models/UserModels');
const jsonwebtoken = require('jsonwebtoken');
const bcryptjs= require('bcryptjs');

exports.register=async(req,res)=>{
    try{
        const {name,email,password,role}=req.body;
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

        //save user
        const newuser =new user({name,email,password:hashpassword,role});
        await newuser.save();
        res.status(201).json({
            message:"user created success",
            user:{name,email,role}
        })

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
        if(!ismatch){
            return res.status(400).json({
                message:"invalid password"
            })
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