const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: Number,
        price: Number,
        vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }],
    
    deliveryCharge: {
    type: Number,
    default: 0
    },

    totalAmount: {
        type: Number,
        required: true 
    },
    adminCommission: { type: Number },
    vendorEarnings: { type: Number },
    status: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'Delivered', 'Cancelled'], 
        default: 'Pending' 
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'esewa'], 
        default: 'COD' 
    },
    paymentInfo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Payment' 
    },
    isPaid: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);