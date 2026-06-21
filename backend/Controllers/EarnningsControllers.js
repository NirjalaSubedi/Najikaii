const Order = require('../models/OrderModels');
const mongoose = require('mongoose');

exports.getVendorEarningsStats = async (req, res) => {
    try {
        const vendorId = req.user.id;
        const orders = await Order.find({
            'items.vendor': vendorId,
            status: 'Delivered'
        });

        let totalRevenue = 0;

        orders.forEach(order => {
            order.items.forEach(item => {
                if (item.vendor.toString() === vendorId.toString()) {
                    totalRevenue += (item.price * item.quantity);
                }
            });
        });

        const yourEarnings = totalRevenue * 0.9;
        const platformFee = totalRevenue * 0.1;

        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const thisMonthOrders = await Order.find({
            'items.vendor': vendorId,
            status: 'Delivered',
            createdAt: { $gte: startOfMonth }
        });

        let thisMonthEarnings = 0;
        thisMonthOrders.forEach(order => {
            order.items.forEach(item => {
                if (item.vendor.toString() === vendorId.toString()) {
                    thisMonthEarnings += (item.price * item.quantity) * 0.9;
                }
            });
        });

        return res.status(200).json({
            success: true,
            totalRevenue: Math.round(totalRevenue),
            yourEarnings: Math.round(yourEarnings),
            platformFee: Math.round(platformFee),
            thisMonthEarnings: Math.round(thisMonthEarnings)
        });

    } catch (error) {
        console.error("Error in getVendorEarningsStats:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
