const User = require('../models/UserModels'); 
const Product = require('../models/ProductModels');

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



