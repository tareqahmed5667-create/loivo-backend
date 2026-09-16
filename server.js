const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // 🆕 Database connection ইম্পোর্ট করা হলো

// Load environment variables (.env ফাইল থেকে ডাটা নেওয়ার জন্য)
dotenv.config();

// Connect to Database
connectDB(); // 🆕 সার্ভার চালুর সাথে সাথে ডাটাবেস কানেক্ট করবে

// Initialize Express App
const app = express();

// ==========================================
// Essential Middlewares
// ==========================================
// ফ্রন্টএন্ড (Next.js) এর সাথে সিকিউরভাবে ডাটা আদান-প্রদানের জন্য
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));

// JSON ডাটা এবং URL encoded ডাটা পড়ার জন্য
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// ==========================================
// API Routes (এই ফাইলগুলো আমরা পরবর্তীতে ধাপে ধাপে তৈরি করব)
// ==========================================
 const authRoutes = require('./routes/authRoutes');
 const vendorRoutes = require('./routes/vendorRoutes');
const productRoutes = require('./routes/productRoutes');
// const orderRoutes = require('./routes/orderRoutes');

// app.use('/api/v1/auth', authRoutes);
 app.use('/api/v1/vendors', vendorRoutes);
// app.use('/api/v1/products', productRoutes);
// app.use('/api/v1/orders', orderRoutes);


// ==========================================
// Health Check Route (সার্ভার ঠিক আছে কিনা চেক করার জন্য)
// ==========================================
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: '🚀 BuyNix API is running successfully!'
    });
});

// ==========================================
// 404 Route Handler (ভুল লিংকে গেলে এই মেসেজ দিবে)
// ==========================================
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API route not found on BuyNix Server'
    });
});

// ==========================================
// Global Error Handling Middleware (প্রোডাকশন রেডি এরর হ্যান্ডলিং)
// ==========================================
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        // প্রোডাকশন মোডে সিকিউরিটির জন্য stack trace হাইড রাখা হয়
        stack: process.env.NODE_ENV === 'production' ? null : err.stack, 
    });
});

// ==========================================
// Start Server
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});