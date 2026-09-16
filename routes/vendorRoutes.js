const express = require('express');
const { 
    registerVendor, 
    getAllVendors, 
    updateVendorStatus 
} = require('../controllers/vendorController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// 1. Register as a Vendor (Any logged-in user can apply)
router.post('/register', protect, registerVendor);

// 2. Get All Vendors (Admin only)
router.route('/')
    .get(protect, authorize('admin'), getAllVendors);

// 3. Update Vendor Status - Approve/Reject (Admin only)
router.route('/:id/status')
    .put(protect, authorize('admin'), updateVendorStatus);

module.exports = router;