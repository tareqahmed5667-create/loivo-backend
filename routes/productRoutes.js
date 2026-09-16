const express = require('express');
const { 
    createProduct, 
    getAllProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/productController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// 1. Get All Products & Create Product
router.route('/')
    .get(getAllProducts) // Public: যে কেউ প্রোডাক্ট দেখতে পারবে (Category & Search ফিল্টারসহ)
    .post(protect, authorize('vendor'), createProduct); // Vendor Only: শুধু ভেন্ডর প্রোডাক্ট আপলোড করতে পারবে

// 2. Get Single Product, Update & Delete
router.route('/:id')
    .get(getProductById) // Public: নির্দিষ্ট প্রোডাক্টের বিস্তারিত দেখা
    .put(protect, authorize('vendor', 'admin'), updateProduct) // Vendor/Admin: প্রোডাক্ট আপডেট
    .delete(protect, authorize('vendor', 'admin'), deleteProduct); // Vendor/Admin: প্রোডাক্ট ডিলিট

module.exports = router;