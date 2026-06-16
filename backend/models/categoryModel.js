const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    slug: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true 
    },
    image: { 
        type: String, 
        required: true 
    },
    bgColor: { 
        type: String, 
        default: '#F3F4F6' 
    },
    iconColor: { 
        type: String, 
        default: '#10B981' 
    },
    description: { 
        type: String 
    }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);