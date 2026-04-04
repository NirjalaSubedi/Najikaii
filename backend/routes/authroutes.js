const express =require('express');
const router= express.Router();
const {register,login,updateProfile}= require('../Controllers/authcontrollers');
const {authmiddlewares,authorizeRoles}= require('../middlewares/authmiddlewares');
const{Addproduct, getmyProduct, getAllProducts,updateProducts,deleteProduct}= require("../Controllers/productControllers");
const {verifyOtp}= require("../Controllers/verifyOTP");

router.post('/register',register);

//verify otp
router.post('/verify-Otp',verifyOtp);
router.post('/login',login);
router.put('/update-userProfile',authmiddlewares,updateProfile);

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
router.put('/updateProduct/:id',authmiddlewares,authorizeRoles('Vendor'),updateProducts);

//product owner and vendor can only delete products 
router.delete('/delete-product/:id',authmiddlewares,authorizeRoles('Vendor','Admin'),deleteProduct);
module.exports=router;
