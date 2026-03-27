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
    
})
