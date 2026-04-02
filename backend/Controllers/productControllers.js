const product = require ('../models/ProductModels');

//for adding new product
exports.Addproduct= async (req,res)=>{
    try{
        const{name, description, price, category, unitType, stock, image}=req.body;
        const newProduct= new product({
            vendor:req.user.id,
            name,
            description,
            price,
            category,
            unitType,
            stock,
            image
        })

        //saving it in database
        await newProduct.save();
        
        res.status(201).json({
            success:true,
            message:"Product successdully database ma create vayo",
            product:newProduct
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//displaying only my product 
exports.getmyProduct= async(req,res)=>{
    try{
        //searching only the logedin user product from database
        const products = await product.find({vendor:req.user.id});
        res.status(200).json({
            success:true,
            message:"logedin vendor ko registerd product haru",
            products
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })

    }
}

//displaying all product 
exports.getAllProducts = async (req, res) => {
    try {
        const products = await product.find().populate('vendor', 'name email');

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

//only product owner can upadte product
exports.updateProducts = async (req,res)=>{
    try{
        //taking product id from URL
        let productdata= await product.findById(req.params.id);
        if(!productdata){
            return res.status(404).json({
                success:false,
                message:"product update garna ko lagi id milena"
            })
        }

        if (productdata.vendor.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: "Timi yo product ko owner hoinau, update garna mildaina!" 
            });
        }

        //when we get the product id to update
        productdata = await product.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Naya updated data return garna
            runValidators: true // Model ko validation check garna
        });

        res.status(200).json({
            success: true,
            message: "Product updated successfully!",
            product: productdata
        });

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//deleting products
exports.deleteProduct = async (req,res)=>{
    try{

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

