const express = require('express');
const router = express.Router();
const { esewaPayment, esewaFailure } = require('../Controllers/paymentcontrollers'); 
const crypto = require('crypto');

// १. Initiate eSewa Payment Signature
router.post('/initiate-esewa', async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({ success: false, message: "Amount ra Order ID missing chha." });
    }

    const normalizedAmount = Number(amount);
    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid payment amount.' });
    }

    const formattedAmount = normalizedAmount.toFixed(2);
    const transactionUuid = String(orderId).trim();

    const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";
    const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";

    const signatureString = `total_amount=${formattedAmount},transaction_uuid=${transactionUuid},product_code=${ESEWA_PRODUCT_CODE}`;
    
    const signature = crypto
      .createHmac('sha256', ESEWA_SECRET_KEY)
      .update(signatureString)
      .digest('base64');

    const payment_data = {
      amount: formattedAmount,
      failure_url: "http://localhost:5000/api/payment/esewa-failure",
      product_delivery_charge: "0.00",
      product_service_charge: "0.00",
      product_code: ESEWA_PRODUCT_CODE,
      signature: signature,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      success_url: "http://localhost:5000/api/payment/esewa-success",
      tax_amount: "0.00",
      total_amount: formattedAmount,
      transaction_uuid: transactionUuid
    };

    res.status(200).json({ success: true, payment_data });
  } catch (error) {
    console.error("eSewa redirection matrix initiation logic crashed:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// २. Handles eSewa Automated Redirects (GET/POST query standard mapping)
// router.all प्रयोग गर्दा eSewa ले GET वा POST जे पठाए पनि ब्याकइन्डले समात्न सक्छ र बीचमै लोजिक ड्रप हुँदैन।
router.all('/esewa-success', esewaPayment);
router.all('/esewa-failure', esewaFailure);
router.all('/verify-esewa', esewaPayment);

module.exports = router;