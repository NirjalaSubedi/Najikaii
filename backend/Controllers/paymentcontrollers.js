const crypto = require('crypto');
const axios= require('axios');
const Order= require('../models/OrderModels');
const payment= require('../models/paymentModel');

exports.esewaPayment= async (req,res)=>{
    try{
        const {data} = req.query;

        //data decode gareko
        const decoded = JSON.parse(Buffer.from(data,'base64').toString('utf-8'));

        if (decodedData.status !== 'COMPLETE') {
            return res.status(400).json({
                success: false,
                message: "Payment incomplete bhayo!"
            });
        }

        //Order Verify garne
        const orderId = decodedData.transaction_uuid; 
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order bhetiyena!"
            });
        }
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}