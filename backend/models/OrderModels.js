const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: Number,
        price: Number
    }],
    totalAmount:{
        type: Number,
        required: true 
    },
    adminCommission:{
        type: Number
    }, // 10% logic
    vendorEarnings: {
        type: Number
    },  // 90% logic
    status:{ 
        type: String, 
        enum: ['Pending', 'Confirmed', 'Delivered', 'Cancelled'], 
        default: 'Pending' 
    },
    paymentMethod:{
        type: String,
        enum: ['COD', 'eSewa'], default: 'COD' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);