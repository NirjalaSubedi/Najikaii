const User = require('../models/UserModels'); 
const Product = require('../models/ProductModels');
const Order = require('../models/OrderModels');

exports.viewAllShops = async (req, res) => {
    try {
        const { lat, lng } = req.query;
        let query = { role: 'Vendor' }; 
        if (lat && lng) {
            query.location = {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    }
                }
            };
        }

        const shops = await User.find(query);
        res.status(200).json(shops);
    } catch (error) {
        res.status(500).json({ message: "Shops fetch garna sakiyena", error: error.message });
    }
};

exports.getAllShopsForAdmin = async (req, res) => {
    try {
        const vendors = await User.find({ role: 'Vendor' }).sort({ createdAt: -1 }).lean(); 

        const vendorsWithStats = await Promise.all(
            vendors.map(async (vendor) => {
                const productCount = await Product.countDocuments({ vendor: vendor._id });
                
                return {
                    ...vendor,
                    totalProducts: productCount,
                    totalRevenue: 0 
                };
            })
        );
        
        return res.status(200).json({
            success: true,
            count: vendorsWithStats.length,
            data: vendorsWithStats
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Admin vendor data fetch garna sakiyena",
            error: error.message
        });
    }
};

exports.getVendorOverview = async (req, res) => {
    try {
        const vendorId = req.user.id;

        const totalProducts = await Product.countDocuments({ vendor: vendorId });

        const orders = await Order.find({ 'items.vendor': vendorId }).lean();

        const totalOrders = orders.length;

        let totalSales = 0;
        orders.forEach(order => {
            const vendorItems = order.items.filter(it => String(it.vendor) === String(vendorId));
            const vendorTotal = vendorItems.reduce((s, it) => s + (Number(it.price || 0) * Number(it.quantity || 0)), 0);
            totalSales += vendorTotal;
        });

        const vendorEarnings = Math.round(totalSales * 0.90);
        const adminCommission = Math.round(totalSales * 0.10);

        const recentOrders = await Order.find({ 'items.vendor': vendorId })
            .sort({ createdAt: -1 })
            .limit(4)
            .populate('customer', 'name')
            .populate('items.product', 'name')
            .lean();

        const lowStockProducts = await Product.find({ vendor: vendorId, stock: { $lte: 10 } })
            .select('name stock image sellingPrice')
            .lean();

        return res.status(200).json({
            success: true,
            data: {
                totalProducts,
                totalOrders,
                totalSales,
                vendorEarnings,
                adminCommission,
                recentOrders,
                lowStockProducts
            }
        });

    } catch (error) {
        console.error('Vendor overview fetch failed:', error);
        return res.status(500).json({ success: false, message: 'Vendor overview load failed', error: error.message });
    }
};



