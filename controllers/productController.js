const Product = require('../models/Product');
const Vendor = require('../models/Vendor');

// ==========================================
// 1. CREATE PRODUCT (Vendor Only)
// ==========================================
exports.createProduct = async (req, res, next) => {
    try {
        // Find vendor associated with the logged-in user
        const vendor = await Vendor.findOne({ user: req.user.id });
        if (!vendor || vendor.status !== 'approved') {
            return res.status(403).json({
                success: false,
                message: 'Only approved vendors can create products.',
            });
        }

        req.body.vendor = vendor._id;

        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================================
// 2. GET ALL PRODUCTS (With Category & Search Filters)
// ==========================================
exports.getAllProducts = async (req, res, next) => {
    try {
        const { keyword, category } = req.query;
        let query = {};

        // Search by keyword (Product Name)
        if (keyword) {
            query.name = {
                $regex: keyword,
                $options: 'insensitive', // Case insensitive search
            };
        }

        // Filter by Category (e.g., 'Home Decor', 'Kitchen Appliances')
        if (category) {
            query.category = category;
        }

        const products = await Product.find(query).populate('vendor', 'storeName');

        res.status(200).json({
            success: true,
            count: products.length,
            products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================================
// 3. GET SINGLE PRODUCT BY ID
// ==========================================
exports.getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('vendor', 'storeName contactEmail phoneNumber');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================================
// 4. UPDATE PRODUCT (Vendor Owner or Admin)
// ==========================================
exports.updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================================
// 5. DELETE PRODUCT
// ==========================================
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};