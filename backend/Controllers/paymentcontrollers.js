const crypto = require('crypto');
const mongoose = require('mongoose');
const Order = require('../models/OrderModels');
const Payment = require('../models/paymentModel');

const redirectFailure = (res, reason, detail) => {
    const query = new URLSearchParams({ status: 'failed', reason });
    if (detail) {
        query.set('detail', String(detail));
    }
    return res.redirect(`http://localhost:5173/payment-failed?${query.toString()}`);
};

exports.initiateEsewa = async (req, res) => {
    try {
        const { amount, orderId } = req.body;

        if (!amount || !orderId) {
            return res.status(400).json({
                success: false,
                message: "Amount and OrderId are required fields."
            });
        }

        const secretKey = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";
        const productCode = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";
        
        const totalAmountStr = Number(amount).toFixed(2);
        const transactionUuid = String(orderId).trim();

        const dataString = `total_amount=${totalAmountStr},transaction_uuid=${transactionUuid},product_code=${productCode}`;
        
        const signature = crypto
            .createHmac('sha256', secretKey)
            .update(dataString)
            .digest('base64');

        return res.status(200).json({
            success: true,
            payment_data: {
                amount: totalAmountStr,
                tax_amount: "0.00",
                total_amount: totalAmountStr,
                transaction_uuid: transactionUuid,
                product_code: productCode,
                product_service_charge: "0.00",
                product_delivery_charge: "0.00",
                signed_field_names: "total_amount,transaction_uuid,product_code",
                signature: signature
            }
        });

    } catch (error) {
        console.error("[eSewa Initiate Error]:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to initiate eSewa payment signature.",
            error: error.message
        });
    }
};

exports.esewaPayment = async (req, res) => {
    try {
        const dataToken = req.query.data || req.body.data;

        if (!dataToken) {
            if (req.method === 'GET') {
                console.error('[eSewa Verify] Missing encoded data in callback', { query: req.query });
                return redirectFailure(res, 'missing_data', 'encoded_data_missing');
            }
            return res.status(400).json({ success: false, message: "Encoded data missing" });
        }

        const normalizedToken = String(dataToken).trim().replace(/ /g, '+');
        const decodedString = Buffer.from(normalizedToken, 'base64').toString('utf-8');
        const decoded = JSON.parse(decodedString);

        console.log("Decoded eSewa Verification Payload:", decoded);

        if (decoded.status !== 'COMPLETE') {
            if (req.method === 'GET') {
                console.error('[eSewa Verify] Incomplete status received', { status: decoded.status, transaction_uuid: decoded.transaction_uuid });
                return redirectFailure(res, 'incomplete_status', decoded.status);
            }
            return res.status(400).json({ success: false, message: `Payment status is incomplete: ${decoded.status}` });
        }

        const secretKey = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";

        const signedFields = String(decoded.signed_field_names || '')
            .split(',')
            .map((field) => field.trim())
            .filter(Boolean);

        const expectedDataString = signedFields
            .map((field) => `${field}=${decoded[field] ?? ''}`)
            .join(',');

        const generatedHash = crypto
            .createHmac('sha256', secretKey)
            .update(expectedDataString)
            .digest('base64')
            .trim();

        const receivedSignature = String(decoded.signature || '').trim();

        const generatedBuffer = Buffer.from(generatedHash, 'utf-8');
        const receivedBuffer = Buffer.from(receivedSignature, 'utf-8');

        if (generatedBuffer.length !== receivedBuffer.length || !crypto.timingSafeEqual(generatedBuffer, receivedBuffer)) {
            if (req.method === 'GET') {
                console.error('[eSewa Verify] Signature mismatch detected', {
                    expectedDataString,
                    generatedHash,
                    receivedSignature,
                });
                return redirectFailure(res, 'signature_mismatch', 'signature_check_failed');
            }
            return res.status(401).json({ success: false, message: "Security Warning: Signature Mismatch!" });
        }

        const existingPayment = await Payment.findOne({ transactionId: decoded.transaction_code }).populate('order');
        if (existingPayment) {
            if (req.method === 'GET') {
                return res.redirect(`http://localhost:5173/payment-success?status=success&orderId=${existingPayment.order?._id || ''}`);
            }
            return res.status(200).json({
                success: true,
                message: 'Payment already verified earlier.',
                order: existingPayment.order
            });
        }

        const uuidParts = String(decoded.transaction_uuid || '').split('-').map((part) => part.trim());
        const parsedOrderId = uuidParts.find((part) => mongoose.Types.ObjectId.isValid(part)) || uuidParts[0] || '';

        if (!mongoose.Types.ObjectId.isValid(parsedOrderId)) {
            console.error(`Invalid MongoDB ObjectId detected: "${parsedOrderId}"`);
            if (req.method === 'GET') {
                return redirectFailure(res, 'invalid_order_id', parsedOrderId);
            }
            return res.status(400).json({ success: false, message: `Invalid Order ID format: '${parsedOrderId}'` });
        }

        const order = await Order.findById(parsedOrderId);
        if (!order) {
            if (req.method === 'GET') {
                console.error('[eSewa Verify] Order not found for ID:', parsedOrderId);
                return redirectFailure(res, 'order_not_found', parsedOrderId);
            }
            return res.status(404).json({ success: false, message: "Order not found in database repository." });
        }

        const cleanEsewaAmount = Number(String(decoded.total_amount).replace(/,/g, ''));
        const cleanOrderAmount = Number(order.totalAmount);

        if (Math.abs(cleanOrderAmount - cleanEsewaAmount) > 0.01) {
            if (req.method === 'GET') {
                console.error('[eSewa Verify] Amount mismatch detected', {
                    orderId: order._id,
                    orderAmount: cleanOrderAmount,
                    esewaAmount: cleanEsewaAmount,
                });
                return redirectFailure(res, 'amount_mismatch', `order:${cleanOrderAmount}|esewa:${cleanEsewaAmount}`);
            }
            return res.status(400).json({ success: false, message: "Critical Risk: Amount mismatch detected!" });
        }

        const newPayment = new Payment({
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

        if (req.method === 'GET') {
            return res.redirect(`http://localhost:5173/payment-success?status=success&orderId=${order._id}`);
        }

        return res.status(200).json({ 
            success: true, 
            message: "Payment successfully verified and order confirmed!", 
            order 
        });

    } catch (error) {
        console.error("eSewa verification critical exception:", error);
        if (req.method === 'GET') {
            return redirectFailure(res, 'server_error', error.message);
        }
        return res.status(500).json({ success: false, message: "Internal server error occurred.", error: error.message });
    }
};

exports.esewaFailure = async (req, res) => {
    try {
        const detail = req.query.message || req.query.error || req.query.reason || 'gateway_rejected';
        console.error('[eSewa Failure Callback] Gateway redirected to failure URL', { query: req.query });
        return redirectFailure(res, 'gateway_failed', detail);
    } catch (error) {
        console.error('[eSewa Failure Callback] Unexpected error', error);
        return redirectFailure(res, 'gateway_failed', 'failure_callback_exception');
    }
};