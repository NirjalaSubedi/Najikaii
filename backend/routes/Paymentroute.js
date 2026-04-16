const express = require('express');
const router = express.Router();
const { esewaPayment } = require('../Controllers/paymentcontrollers');

router.get('/esewa-success', esewaPayment);

module.exports = router;