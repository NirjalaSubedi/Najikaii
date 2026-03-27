const mongoose= require('mongoose');
const ProductSchema= new mongoose.Schema({
    vendor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true 
    },
    name:{
        type: String,
        required: true 
    },
    description: String,
    price:{
        type: Number,
        required: true
    },
    category: String, // e.g Grocery, Vegetables, Dairy
    unitType:{
        type: String,
        enum: ['kg', 'liter', 'piece', 'packet'],
        required: true
    },
    stock:{
        type: Number,
        required: true,
        default: 0
    }, // This is for your Atomic Check
    image: String
}, { timestamps: true})
module.exports=mongoose.ProductSchema('Product',ProductSchema);
