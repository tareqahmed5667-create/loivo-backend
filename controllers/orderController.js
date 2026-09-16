const Order = require('../models/Order');
const Product = require('../models/Product');

// ==========================================
// 1. CREATE NEW ORDER (Customer)
// ==========================================
exports.createOrder = async (req, res, next) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentInfo,
            itemsPrice,
            shippingPrice,
            totalPrice
        } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No order items provided',
            });
        }

        // Create Order
        const order = await Order.create({
            user: req.user.id,
            orderItems,
            shippingAddress,
            paymentInfo,
            itemsPrice,
            shippingPrice,
            totalPrice,
            orderStatus: 'Pending'
        });

        // Optional: Reduce stock for ordered products
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock -= item.quantity;
                await product.save();
            }
        }

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================================
// 2. GET LOGGED IN USER ORDERS (Customer Portal)
// ==========================================
exports.getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================================
// 3. GET SINGLE ORDER BY ID
// ==========================================
exports.getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found with this ID',
            });
        }

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================================
// 4. GET ALL ORDERS (Admin Panel)
// ==========================================
exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().populate('user', 'name email');

        let totalRevenue = 0;
        orders.forEach(order => {
            totalRevenue += order.totalPrice;
        });

        res.status(200).json({
            success: true,
            count: orders.length,
            totalRevenue,
            orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================================
// 5. UPDATE ORDER STATUS (Real-time Tracking: Admin/Vendor)
// ==========================================
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        if (order.orderStatus === 'Delivered') {
            return res.status(400).json({
                success: false,
                message: 'This order has already been delivered',
            });
        }

        order.orderStatus = req.body.status; // Pending, Processing, Shipped, Delivered, Cancelled

        if (req.body.status === 'Delivered') {
            order.deliveredAt = Date.now();
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: `Order status updated to ${req.body.status}`,
            order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};