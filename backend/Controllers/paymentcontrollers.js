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

        const secretKey = process.env.ESEWA_SECRET_KEY;
        const productCode = process.env.ESEWA_PRODUCT_CODE;
        
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
        if (!dataToken) return redirectFailure(res, 'missing_data', 'encoded_data_missing');

        const normalizedToken = String(dataToken).trim().replace(/ /g, '+');
        const decodedString = Buffer.from(normalizedToken, 'base64').toString('utf-8');
        const decoded = JSON.parse(decodedString);
        const cleanEsewaAmount = String(decoded.total_amount).replace(/,/g, '');

        if (decoded.status !== 'COMPLETE') {
            return redirectFailure(res, 'incomplete_status', decoded.status);
        }

        const secretKey = process.env.ESEWA_SECRET_KEY;
        const signedFields = String(decoded.signed_field_names || '').split(',').map(f => f.trim()).filter(Boolean);

        const expectedDataString = signedFields
            .map((field) => {
                if (field === 'total_amount') return `${field}=${cleanEsewaAmount}`;
                return `${field}=${decoded[field] ?? ''}`;
            })
            .join(',');

        const generatedHash = crypto
            .createHmac('sha256', secretKey)
            .update(expectedDataString)
            .digest('base64')
            .trim();

        const receivedSignature = String(decoded.signature || '').trim();
        
        if (generatedHash !== receivedSignature) {
            console.error('[eSewa Verify] Signature mismatch', { expectedDataString, generatedHash, receivedSignature });
            return redirectFailure(res, 'signature_mismatch', 'signature_check_failed');
        }

        const uuidParts = String(decoded.transaction_uuid || '').split('-').map((p) => p.trim());
        const parsedOrderId = uuidParts.find((part) => mongoose.Types.ObjectId.isValid(part)) || uuidParts[0];

        const order = await Order.findById(parsedOrderId);
        if (!order) return redirectFailure(res, 'order_not_found', parsedOrderId);

        const cleanOrderAmount = Number(order.totalAmount).toFixed(2);
        const floatEsewaAmount = Number(cleanEsewaAmount).toFixed(2);

        if (cleanOrderAmount !== floatEsewaAmount) {
            return redirectFailure(res, 'amount_mismatch', `order:${cleanOrderAmount}|esewa:${floatEsewaAmount}`);
        }

        const existingPayment = await Payment.findOne({ transactionId: decoded.transaction_code });
        
        if (!existingPayment) {
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
            console.log(newPayment);
        }

        return res.redirect(`http://localhost:5173/payment-success?status=success&orderId=${order._id}`);

    } catch (error) {
        console.error("eSewa verification error:", error);
        return redirectFailure(res, 'server_error', error.message);
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