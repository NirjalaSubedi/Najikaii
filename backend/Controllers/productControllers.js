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


