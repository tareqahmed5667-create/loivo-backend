const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide product name'],
        trim: true,
        maxLength: [150, 'Product name cannot exceed 150 characters']
    },
    slug: {
        type: String,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, 'Please provide product description']
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: [
            'Home Decor', 
            'Kitchen Appliances', 
            'Electronics', 
            'Fashion', 
            'Others'
        ] // BuyNix রিকোয়ারমেন্ট অনুযায়ী নির্দিষ্ট ক্যাটাগরি
    },
    price: {
        type: Number,
        required: [true, 'Please provide product price'],
        maxLength: [10, 'Price cannot exceed 10 figures']
    },
    compareAtPrice: {
        type: Number, // ডিসকাউন্ট দেখানোর জন্য আগের বেশি দাম (Optional)
        default: 0
    },
    stock: {
        type: Number,
        required: [true, 'Please provide product stock quantity'],
        default: 0,
        min: [0, 'Stock cannot be negative']
    },
    images: [
        {
            public_id: { type: String, required: true },
            url: { type: String, required: true }
        }
    ],
    vendor: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vendor',
        required: true // কোন ভেন্ডর প্রোডাক্টটি আপলোড করেছে
    },
    ratings: {
        type: Number,
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true // অ্যাডমিন বা ভেন্ডর চাইলে প্রোডাক্ট হাইড বা আনহাইড করতে পারবে
    }
}, {
    timestamps: true
});

// প্রোডাক্টের নামের উপর ভিত্তি করে ইউনিক slug তৈরি করার মিডলওয়্যার
productSchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);