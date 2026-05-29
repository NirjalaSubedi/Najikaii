const product = require('../models/ProductModels');

// for adding new product
exports.Addproduct = async (req, res) => {
    try {
        const { name, description, actualPrice, sellingPrice, category, unitType, stock, image } = req.body;
        
        const newProduct = new product({
            vendor: req.user.id,
            name,
            description,
            actualPrice,   
            sellingPrice,  
            category,
            unitType,
            stock,
            image
        });

        await newProduct.save();
        
        res.status(201).json({
            success: true,
            message: "Product successfully database ma create vayo",
            product: newProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getmyProduct = async (req, res) => {
    try {
        const products = await product.find({ vendor: req.user.id });
        res.status(200).json({
            success: true,
            message: "logedin vendor ko registerd product haru",
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// displaying all product 
exports.getAllProducts = async (req, res) => {
    try {
        const { lat, lng, sort } = req.query;

        if (!lat || !lng) {
            const products = await product.find().populate('vendor', 'name email shopName');
            return res.status(200).json({
                success: true,
                count: products.length,
                products
            });
        }

        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);

        let pipeline = [
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [userLng, userLat] },
                    distanceField: "distance",
                    distanceMultiplier: 0.001,
                    spherical: true
                }
            },
            {
                $lookup: {
                    from: "vendors",
                    localField: "vendor",
                    foreignField: "_id",
                    as: "vendorDetails"
                }
            },
            {
                $unwind: {
                    path: "$vendorDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    actualPrice: 1,
                    sellingPrice: 1,
                    category: 1,
                    unitType: 1,
                    stock: 1,
                    image: 1,
                    distance: 1,
                    vendor: {
                        _id: "$vendorDetails._id",
                        name: "$vendorDetails.name",
                        email: "$vendorDetails.email",
                        shopName: "$vendorDetails.shopName"
                    }
                }
            }
        ];

        if (sort === "Price: Low→High") {
            pipeline.push({ $sort: { sellingPrice: 1 } });
        } else if (sort === "Price: High→Low") {
            pipeline.push({ $sort: { sellingPrice: -1 } });
        } else {
            pipeline.push({ $sort: { distance: 1 } });
        }

        const products = await product.aggregate(pipeline);

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// only product owner can update product
exports.updateProducts = async (req, res) => {
    try {
        // taking product id from URL
        let productdata = await product.findById(req.params.id);
        if (!productdata) {
            return res.status(404).json({
                success: false,
                message: "product update garna ko lagi id milena"
            });
        }

        if (productdata.vendor.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: "Timi yo product ko owner hoinau, update garna mildaina!" 
            });
        }

        productdata = await product.findByIdAndUpdate(req.params.id, req.body, {
            new: true, 
            runValidators: true 
        });

        res.status(200).json({
            success: true,
            message: "Product updated successfully!",
            product: productdata
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// deleting products
exports.deleteProduct = async (req, res) => {
    try {
        const productdata = await product.findById(req.params.id);
        if (!productdata) {
            return res.status(404).json({
                success: false,
                message: "delete garna ko lagi product vetiyana"
            });
        }
        const isAdmin = req.user.role === 'Admin';
        const isOwner = productdata.vendor.toString() === req.user.id;

        if (!isAdmin && !isOwner) {
            return res.status(403).json({
                success: false,
                message: "Timi saga yo product delete garne authorization xaiina"
            });
        }

        await product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: isAdmin ? "Admin le product delete gardiyo !" : "Vendor le aafnu product delete garo"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};