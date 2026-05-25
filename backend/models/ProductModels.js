const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true 
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    actualPrice: {
        type: Number,
        required: true
    },
    sellingPrice: {
        type: Number,
        required: true,
        validate: {
            validator: function(value) {
                return value <= this.actualPrice;
            },
            message: "Selling price ({VALUE}) actual price bhanda dherai huna sakdainna."
        }
    },
    category: {
        type: String,
        required: true
    }, 
    unitType: {
        type: String,
        enum: ['kg', 'liter', 'piece', 'packet', 'gram', 'bundle'], 
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    }, 
    image: {
        type: String,
        required: true 
    },
    distance: {
        type: Number, 
        default: 0.5
    },
    rating: {
        type: Number,
        default: 4.5
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

ProductSchema.virtual('discountPercentage').get(function() {
    if (this.actualPrice && this.sellingPrice && this.actualPrice > this.sellingPrice) {
        const discount = ((this.actualPrice - this.sellingPrice) / this.actualPrice) * 100;
        return Math.round(discount);
    }
    return 0;
});

module.exports = mongoose.model('Product', ProductSchema);