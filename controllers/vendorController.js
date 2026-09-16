const Vendor = require('../models/Vendor');
const User = require('../models/User');

// ==========================================
// 1. REGISTER AS A VENDOR (Apply for Store)
// ==========================================
exports.registerVendor = async (req, res, next) => {
    try {
        const { 
            storeName, 
            ownerName, 
            contactEmail, 
            phoneNumber, 
            address, 
            nidNumber, 
            tradeLicenseNumber, 
            bankOrMobileBanking 
        } = req.body;

        // Check if user is already a vendor
        const existingVendor = await Vendor.findOne({ user: req.user.id });
        if (existingVendor) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied or registered as a vendor.',
            });
        }

        // Check if Store Name or Trade License already exists
        const storeExists = await Vendor.findOne({ storeName });
        if (storeExists) {
            return res.status(400).json({
                success: false,
                message: 'Store name is already taken. Choose another one.',
            });
        }

        // Create Vendor Application
        const vendor = await Vendor.create({
            user: req.user.id,
            storeName,
            ownerName,
            contactEmail,
            phoneNumber,
            address,
            nidNumber,
            tradeLicenseNumber,
            bankOrMobileBanking,
            status: 'pending' // Default status
        });

        // Update User role reference or status if needed (Optional)
        await User.findByIdAndUpdate(req.user.id, { role: 'vendor' });

        res.status(201).json({
            success: true,
            message: 'Vendor application submitted successfully. Waiting for Admin approval.',
            vendor,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================================
// 2. GET ALL VENDORS (Admin Panel)
// ==========================================
exports.getAllVendors = async (req, res, next) => {
    try {
        const vendors = await Vendor.find().populate('user', 'name email');

        res.status(200).json({
            success: true,
            count: vendors.length,
            vendors,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================================
// 3. UPDATE VENDOR STATUS (Admin Approval/Rejection)
// ==========================================
exports.updateVendorStatus = async (req, res, next) => {
    try {
        const { status } = req.body; // 'approved' or 'rejected'

        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor application not found',
            });
        }

        vendor.status = status;
        await vendor.save();

        res.status(200).json({
            success: true,
            message: `Vendor status updated to ${status} successfully`,
            vendor,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};