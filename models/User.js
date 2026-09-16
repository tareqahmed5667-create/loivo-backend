const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true,
        maxLength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false // সিকিউরিটির জন্য API রেসপন্সে ডিফল্টভাবে পাসওয়ার্ড হাইড থাকবে
    },
    role: {
        type: String,
        enum: ['customer', 'vendor', 'admin'],
        default: 'customer' // ডিফল্টভাবে সবাই কাস্টমার হিসেবে একাউন্ট খুলবে
    },
    phone: {
        type: String,
        match: [
            /^(?:\+88|88)?(01[3-9]\d{8})$/, 
            'Please provide a valid Bangladeshi phone number'
        ]
    },
    avatar: {
        type: String,
        default: 'default_avatar.jpg' // প্রোফাইল পিকচার না দিলে এটি ডিফল্ট থাকবে
    },
    isVerified: {
        type: Boolean,
        default: false // ইমেইল ভেরিফিকেশনের জন্য
    }
}, {
    timestamps: true // এটি অটোমেটিকভাবে createdAt এবং updatedAt ফিল্ড তৈরি করবে
});

// ==========================================
// Password Hash Middleware 
// (ডাটাবেসে সেভ হওয়ার আগে পাসওয়ার্ড এনক্রিপ্ট করবে)
// ==========================================
userSchema.pre('save', async function(next) {
    // যদি পাসওয়ার্ড পরিবর্তন না হয়, তবে সামনের ধাপে চলে যাবে
    if (!this.isModified('password')) {
        next();
    }
    
    // bcryptjs দিয়ে পাসওয়ার্ড হ্যাশ করা হচ্ছে
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// ==========================================
// Match Password Method
// (লগইন করার সময় ইউজার পাসওয়ার্ড ও ডাটাবেসের পাসওয়ার্ড মেলাবে)
// ==========================================
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);