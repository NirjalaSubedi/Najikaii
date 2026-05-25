const User = require('../models/UserModels'); // UserModels.js लाई सही path बाट import गरेको

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
        const vendors = await User.find({ role: 'Vendor' }).sort({ createdAt: -1 });
        
        return res.status(200).json({
            success: true,
            count: vendors.length,
            data: vendors
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Admin vendor data fetch garna sakiyena",
            error: error.message
        });
    }
};