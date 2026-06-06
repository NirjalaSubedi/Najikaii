const express = require('express');
const router = express.Router();
const { esewaPayment } = require('../Controllers/paymentcontrollers'); 
const crypto = require('crypto');
router.post('/initiate-esewa', async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({ success: false, message: "Amount ra Order ID missing chha." });
    }

    const secretKey = process.env.ESEWA_SECRET_KEY;
    const productCode = process.env.ESEWA_PRODUCT_CODE;

    if (!secretKey || !productCode) {
      return res.status(500).json({ 
        success: false, 
        message: "Server Configuration Error: .env file ma esewa ko code vetiyamna ." 
      });
    }

    const transactionUuid = `${orderId}-${Date.now()}`; 

   const signatureString = `total_amount=${amount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
    
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(signatureString)
      .digest('base64');

    const payment_data = {
      amount: amount,
      failure_url: "http://localhost:5173/checkout",
      product_delivery_charge: "0",
      product_service_charge: "0",
      product_code: productCode,
      signature: signature,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      success_url: "http://localhost:5173/payment-success", 
      tax_amount: "0",
      total_amount: amount,
      transaction_uuid: transactionUuid
    };

    res.status(200).json({ success: true, payment_data });
  } catch (error) {
    console.error("eSewa redirection matrix initiation logic crashed:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

router.get('/esewa-success', esewaPayment);

module.exports = router;