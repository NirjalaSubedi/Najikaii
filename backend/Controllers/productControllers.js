const product = require('../models/ProductModels');

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

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
        const products = await product.find().populate('vendor', 'name email shopName location');

        const productsWithDistance = products.map((item) => {
            const productData = item.toObject();
            const vendorCoords = productData.vendor?.location?.coordinates;

            if (Array.isArray(vendorCoords) && vendorCoords.length === 2) {
                productData.distance = calculateDistance(
                    userLat,
                    userLng,
                    vendorCoords[1],
                    vendorCoords[0]
                );
            } else {
                productData.distance = Number.POSITIVE_INFINITY;
            }

            return productData;
        });

        if (sort === "Price: Low→High") {
            productsWithDistance.sort((a, b) => (a.sellingPrice ?? a.actualPrice ?? 0) - (b.sellingPrice ?? b.actualPrice ?? 0));
        } else if (sort === "Price: High→Low") {
            productsWithDistance.sort((a, b) => (b.sellingPrice ?? b.actualPrice ?? 0) - (a.sellingPrice ?? a.actualPrice ?? 0));
        } else if (sort === "Top Rated") {
            productsWithDistance.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        } else {
            productsWithDistance.sort((a, b) => (a.distance ?? Number.POSITIVE_INFINITY) - (b.distance ?? Number.POSITIVE_INFINITY));
        }

        res.status(200).json({
            success: true,
            count: productsWithDistance.length,
            products: productsWithDistance
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const productData = await product.findById(req.params.id).populate('vendor', 'name email shopName location shopImage');

        if (!productData) {
            return res.status(404).json({
                success: false,
                message: "Product bhetiyena"
            });
        }

        res.status(200).json({
            success: true,
            product: productData
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