const crypto = require('crypto');
const Order = require('../models/OrderModels');
const payment = require('../models/paymentModel');

exports.esewaPayment = async (req, res) => {
    try {
        const dataToken = req.query.data || req.body.data;

        if(!dataToken){
            res.status(400).json({
                success:False,
                message:"Ecoded data missing"
            })
        }
        

        //Safe base64 decode mapping
        const decodedString = Buffer.from(dataToken, 'base64').toString('utf-8');
        const decoded = JSON.parse(decodedString);

        console.log("Decoded eSewa Payload:", decoded);

        if (decoded.status !== 'COMPLETE') {
            return res.status(400).json({ success: false, message: "Payment status is incomplete!" });
        }

        //KEY SECURITY SIGNATURE VALIDATION
        const secretKey = "8gBm/:&EnhH.1/q";
        
        const expectedDataString = `transaction_code=${decoded.transaction_code},status=${decoded.status},total_amount=${decoded.total_amount},transaction_uuid=${decoded.transaction_uuid},product_code=${decoded.product_code},signed_field_names=${decoded.signed_field_names}`;
        
        const generatedHash = crypto
            .createHmac('sha256', secretKey)
            .update(expectedDataString)
            .digest('base64');

        if (generatedHash !== decoded.signature) {
            return res.status(401).json({ success: false, message: "Security Warning: Signature Mismatch! Fraud Detected." });
        }

        //Safe transaction uuid resolution tracking pattern setup rule
        const uuidParts = decoded.transaction_uuid.split('-');
        const parsedOrderId = uuidParts.length > 1 ? uuidParts[1] : decoded.transaction_uuid;

        const order = await Order.findById(parsedOrderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order bhetiyena schema repository ma!" });
        }

        const cleanEsewaAmount = Number(String(decoded.total_amount).replace(/,/g, ''));
        const cleanOrderAmount = Number(order.totalAmount);

        if (cleanOrderAmount !== cleanEsewaAmount) {
            return res.status(400).json({ success: false, message: "Critical Risk: Amount mismatch detected!" });
        }

        //Atomic Payment Generation Object Insertion
        const newPayment = new payment({
            order: order._id,
            user: order.customer,
            transactionId: decoded.transaction_code,
            amount: cleanEsewaAmount,
            paymentMethod: 'esewa',
            status: 'completed',
            paymentDetails: decoded
        });
        await newPayment.save();

        order.isPaid = true; 
        order.paymentInfo = newPayment._id;
        order.status = 'Confirmed';
        await order.save();

        return res.status(200).json({ 
            success: true, 
            message: "Payment successfully verified and order confirmed!", 
            order 
        });

    } catch (error) {
        console.error("eSewa verification stack trace failure:", error);
        return res.status(500).json({
            success: false,
            message: "Internal tracking server breakdown dynamic catch block routing.",
            error: error.message
        });
    }
};