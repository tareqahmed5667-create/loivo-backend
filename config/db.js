const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // .env ফাইল থেকে MONGO_URI নিয়ে ডাটাবেসে কানেক্ট করা হচ্ছে
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        // কানেকশন ফেইল করলে সার্ভার বন্ধ করে দেওয়া হবে
        process.exit(1);
    }
};

module.exports = connectDB;