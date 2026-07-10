const mongoose= require('mongoose');
const Product = require('./ProductModels');
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
        required: function() {
            return !this.googleId && !this.facebookId;
        }
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

    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [Longitude, Latitude]
            default: [87.1685, 26.6500] // Default Jhumka ko coordinates
        }
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
    shopImage: { 
        type: String, 
        default: 'https://via.placeholder.com/150' 
    },

    otp: {
        type: String
    },
    otpExpire: {
        type: Date
    },

    googleId: { type: String },
    facebookId: { type: String },
    avatar: { type: String },
}, {timestamps: true})

userSchema.index({ location: "2dsphere" });

const deleteVendorProducts = async (targetUserId) => {
    if (!targetUserId) return;

    const vendor = await mongoose.model('User').findById(targetUserId).select('role');
    if (vendor?.role === 'Vendor') {
        await Product.deleteMany({ vendor: targetUserId });
    }
};

userSchema.pre('findOneAndDelete', async function(next) {
    try {
        const targetUser = await this.model.findOne(this.getFilter()).select('_id role');
        if (targetUser?.role === 'Vendor') {
            await Product.deleteMany({ vendor: targetUser._id });
        }
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    try {
        await deleteVendorProducts(this._id);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.pre('deleteOne', { document: false, query: true }, async function(next) {
    try {
        const targetUser = await this.model.findOne(this.getFilter()).select('_id role');
        if (targetUser?.role === 'Vendor') {
            await Product.deleteMany({ vendor: targetUser._id });
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('User', userSchema);