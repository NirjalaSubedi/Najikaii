exports.viewAllShops = async (req, res) => {
    try {
        const { lat, lng } = req.query;

        // Yadi lat/lng pathako cha vane nearest first dekhaucha
        // Natra normal list pathaucha
        let query = {};
        let sortOption = {};

        if (lat && lng) {
            query = {
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [parseFloat(lng), parseFloat(lat)]
                        }
                    }
                }
            };
        }

        const shops = await Shop.find(query);
        res.status(200).json(shops);
    } catch (error) {
        res.status(500).json({ message: "Shops fetch garna sakiyena", error: error.message });
    }
};
