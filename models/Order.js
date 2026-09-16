const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true // অর্ডারটি কোন কাস্টমার করেছে
    },
    orderItems: [
        {
            product: {
                type: mongoose.Schema.ObjectId,
                ref: 'Product',
                required: true
            },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            image: { type: String, required: true },
            vendor: {
                type: mongoose.Schema.ObjectId,
                ref: 'Vendor',
                required: true
            }
        }
    ],
    shippingAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        division: { type: String, required: true },
        district: { type: String, required: true },
        address: { type: String, required: true }
    },
    paymentInfo: {
        id: { type: String }, // Transaction ID from bKash/SSLCommerz
        status: { type: String, default: 'Pending' }, // Pending, Paid, Failed
        method: { type: String, required: true, enum: ['bKash', 'SSLCommerz', 'COD'] }
    },
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0 // কুরিয়ার ইন্টিগ্রেশন (Steadfast/RedX) এর জন্য
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending' // রিয়েল-টাইম অর্ডার ট্র্যাকিং স্ট্যাটাস
    },
    deliveredAt: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);