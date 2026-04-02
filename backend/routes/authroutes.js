const express =require('express');
const router= express.Router();
const {register,login}= require('../Controllers/authcontrollers');
const {authmiddlewares,authorizeRoles}= require('../middlewares/authmiddlewares');
const{Addproduct, getmyProduct, getAllProducts,updateProducts}= require("../Controllers/productControllers");

router.post('/register',register);
router.post('/login',login);
router.get('/test',authmiddlewares,(req,res)=>{
    res.status(200).json({
        success:"true",
        message:"token validate successfull",
        user:req.user
    })
});

router.post('/add-product',authmiddlewares,authorizeRoles('Vendor'),Addproduct);

// Display only my products
router.get('/my-products', authmiddlewares, authorizeRoles('Vendor'),getmyProduct);

// Displaying all product to customer and Admin 
router.get('/all-products', authmiddlewares, authorizeRoles('Customer', 'Admin'),getAllProducts );

//only owner can upadte their product
router.patch('/updateProduct',authmiddlewares,authorizeRoles('Vendor'),updateProducts);
module.exports=router;
