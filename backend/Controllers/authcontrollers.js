const user=require('../models/UserModels');
const jsonwebtoken = require('jsonwebtoken');
const bcryptjs= require('bcryptjs');

exports.register=async(req,res)=>{
    try{
        const {name,email,password,role}=req.body;
        //check if user alredy exist
        let user = await user.findOne({email});
        if(user){
            res.status(400).json({
                message:"user already exist"
            })
        }

        //Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashpassword= await bcryptjs.hash(password,salt);

        //save user
        user =new user({name,email,password:hashpassword,role});
        await user.save();

    }catch(e){
        res.status(500).json({
            error:e.message
        })

    }
}