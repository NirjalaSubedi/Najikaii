const crypto = require('crypto');
const db = require('../db/db');

exports.initiateEsewaPayment = async (req, res) => {
    try {
        const { amount, orderId } = req.body;

        if (!orderId || orderId === 'undefined') {
            return res.status(400).json({ success: false, message: "Validation Error: Received invalid Order ID!" });
        }

        //Mandatory conversion of inputs
        const formattedAmount = Number(amount).toFixed(2).toString();

        //Insert record strictly tracking payment processing pipeline
        const [result] = await db.query(
            "INSERT INTO payments (order_id, payment_method, amount, status) VALUES (?, ?, ?, ?)",
            [orderId, 'esewa', formattedAmount, 'pending']
        );

        const payment_db_id = result.insertId;

        //Official Test Sandbox Settings 
        const product_code = "EPAYTEST";
        const secretKey = "8gBm/:&EnhH.1/q";
        const transaction_uuid = `${payment_db_id}-${orderId}-${Date.now()}`;

        const dataString = `total_amount=${formattedAmount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

        //Encrypting signatures
        const hash = crypto
            .createHmac('sha256', secretKey)
            .update(dataString)
            .digest('base64');

        console.log("Esewa logic ");
        console.log("Verified String Sequence ->", dataString);
        console.log("Generated SHA256 Hash   ->", hash);

        res.json({
            success: true,
            payment_data: {
                amount: formattedAmount,
                tax_amount: "0.00",
                total_amount: formattedAmount,
                transaction_uuid: transaction_uuid,
                product_code: product_code,
                product_service_charge: "0.00",
                product_delivery_charge: "0.00",
                signature: hash,
                success_url: "http://localhost:5000/api/payment/esewa-verify",
                failure_url: "http://localhost:5173/checkout",
                signed_field_names: "total_amount,transaction_uuid,product_code",
            }
        });
    } catch (err) {
        console.error("eSewa initiation processing crashed:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.verifyEsewaPayment = async (req, res) => {
    try {
        const dataToken = req.query.data || req.body.data;

        if (!dataToken) {
            console.error("eSewa Verification Error: Token data parameter not found.");
            return res.status(400).send("Encoded transaction data missing.");
        }

        const decodedString = Buffer.from(dataToken, 'base64').toString('utf-8');
        const decodedData = JSON.parse(decodedString);

        console.log("Decoded eSewa Validation Payload:", decodedData);

        if (decodedData.status === "COMPLETE") {
            const transactionUuidParts = decodedData.transaction_uuid.split('-');
            const payment_id = transactionUuidParts[0];
            const order_id = transactionUuidParts[1];

            // Update Payment table record
            await db.query(
                "UPDATE payments SET status = ?, transaction_id = ?, payment_date = NOW() WHERE id = ?",
                ['paid', decodedData.transaction_code, payment_id]
            );

            // Update main Orders table record
            await db.query(
                "UPDATE orders SET status = 'Confirmed', payment_status = 'Paid' WHERE id = ?",
                [order_id]
            );

            // Fetch user ID to auto flush cart items
            const [orderCheck] = await db.query("SELECT user_id FROM orders WHERE id = ?", [order_id]);
            if (orderCheck.length > 0) {
                await db.query("DELETE FROM cart WHERE user_id = ?", [orderCheck[0].user_id]);
            }

            console.log(`Order ${order_id} fully shifted to PAID in database.`);

            if (req.method === 'GET') {
                // Redirect browser directly to frontend success feedback page
                return res.redirect('http://localhost:5173/payment-success');
            }

            return res.json({ success: true, message: "Payment Verified and Database Updated!" });

        } else {
            if (req.method === 'GET') {
                return res.redirect('http://localhost:5173/checkout?error=failed');
            }
            return res.status(400).json({ success: false, message: `Payment not completed: ${decodedData.status}` });
        }
    } catch (err) {
        console.error("Verification error:", err);
        if (req.method === 'GET') {
            return res.redirect('http://localhost:5173/checkout?error=crash');
        }
        res.status(500).json({ success: false, message: err.message });
    }
};