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
    }catch(e){

    }
}