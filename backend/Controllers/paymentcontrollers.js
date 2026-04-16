const crypto = require('crypto');
const axios= require('axios');
const order= require('../models/OrderModels');
const payment= require('../models/paymentModel');

exports.esewaPayment= async (req,res)=>{
    try{
        const {data} = req.query;

        //data decode gareko
        const decoded = JSON.parse(Buffer.from(data,'base64').toString('utf-8'));
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}