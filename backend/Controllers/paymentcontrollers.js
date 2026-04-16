const crypto = require('crypto');
const axios= require('axios');
const Order= require('../models/OrderModels');
const payment= require('../models/paymentModel');

exports.esewaPayment= async (req,res)=>{
    try{
        const {data} = req.query;

        //data decode gareko
        const decoded = JSON.parse(Buffer.from(data,'base64').toString('utf-8'));

        if (decoded.status !== 'COMPLETE') {
            return res.status(400).json({
                success: false,
                message: "Payment incomplete bhayo!"
            });
        }

        //Order Verify garne
        const orderId = decoded.transaction_uuid; 
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order bhetiyena!"
            });
        }

        //Amount check garne
        if (Number(order.totalAmount) !== Number(decoded.total_amount.replace(/,/g, ''))) {
            return res.status(400).json({
                success: false,
                message: "Amount mismatch bhayo!"
            });
        }

        // 4. Payment record create garne
        const newPayment = new payment({
            order: order._id,
            user: order.customer,
            transactionId: decoded.transaction_code,
            amount: decoded.total_amount,
            paymentMethod: 'esewa',
            status: 'completed',
            paymentDetails: decoded
        });

        await newPayment.save();

        // 5. Order update garne
        order.isPaid = true; 
        order.paymentInfo = newPayment._id;
        order.status = 'Confirmed';
        await order.save();

        res.status(200).json({ 
            success: true, 
            message: "Payment successful ani Order confirm bhayo!", 
            order 
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}