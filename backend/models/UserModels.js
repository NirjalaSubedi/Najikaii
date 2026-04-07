const mongoose= require('mongoose');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['Customer','Vendor','Admin'],
        default:'Customer'
    },
    PhoneNumber:{
        type:String
    },
    Address:{
        street: String,
        city: { type: String, default: 'Jhumka' }, // Default making local area
        province: { type: String, default: 'Koshi' }
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },

    // Vendor specific fields
    status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: function() {
        return this.role === 'Vendor' ? 'Pending' : 'Approved';
    }
    },
    shopName: { type: String },

    otp: {
        type: String
    },
    otpExpire: {
        type: Date
    },
    // UserModels.js bhitra yo thapnus
    cart: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 }
    }]
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema);