const express = require('express');
const { 
    createOrder, 
    getMyOrders, 
    getOrderById, 
    getAllOrders, 
    updateOrderStatus 
} = require('../controllers/orderController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// 1. Create New Order & Get Logged-in Customer Orders
router.route('/')
    .post(protect, createOrder) // Customer: নতুন অর্ডার প্লেস করা
    .get(protect, authorize('admin'), getAllOrders); // Admin: সমস্ত প্ল্যাটফর্ম অর্ডার দেখা

// 2. Get My Orders (Customer Portal)
router.route('/my-orders').get(protect, getMyOrders);

// 3. Get Single Order Details & Update Status
router.route('/:id')
    .get(protect, getOrderById) // Customer/Admin: নির্দিষ্ট অর্ডারের বিস্তারিত
    .put(protect, authorize('admin', 'vendor'), updateOrderStatus); // Admin/Vendor: অর্ডার স্ট্যাটাস আপডেট (রিয়েল-টাইম ট্র্যাকিং)

module.exports = router;