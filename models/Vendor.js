const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        unique: true // প্রতিটি ইউজারের জন্য একটির বেশি ভেন্ডর স্টোর থাকতে পারবে না
    },
    storeName: {
        type: String,
        required: [true, 'Please provide your store name'],
        trim: true,
        unique: true,
        maxLength: [100, 'Store name cannot exceed 100 characters']
    },
    ownerName: {
        type: String,
        required: [true, 'Please provide the owner full name'],
        trim: true
    },
    contactEmail: {
        type: String,
        required: [true, 'Please provide a business contact email'],
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address'
        ]
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please provide a business phone number'],
        match: [
            /^(?:\+88|88)?(01[3-9]\d{8})$/, 
            'Please provide a valid Bangladeshi phone number'
        ]
    },
    address: {
        division: { type: String, required: true },
        district: { type: String, required: true },
        detailedAddress: { type: String, required: true }
    },
    nidNumber: {
        type: String,
        required: [true, 'Please provide your NID number for identity verification'],
        unique: true
    },
    tradeLicenseNumber: {
        type: String,
        required: [true, 'Please provide your Trade License number'],
        unique: true
    },
    bankOrMobileBanking: {
        accountType: {
            type: String,
            enum: ['bKash', 'Nagad', 'Bank'],
            required: true
        },
        accountNumber: {
            type: String,
            required: true
        }
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'suspended'],
        default: 'pending' // অ্যাডমিন অ্যাপ্রুভ না করা পর্যন্ত ভেন্ডর পেন্ডিং থাকবে
    },
    commissionRate: {
        type: Number,
        default: 10 // প্ল্যাটফর্ম কমিশন ডিফল্ট ১০%
    },
    totalRevenue: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Vendor', vendorSchema);