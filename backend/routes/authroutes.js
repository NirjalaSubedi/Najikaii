const express =require('express');
const router= express.Router();
const {register,login,updateProfile,deleteuser,GetMyProfileInfo,getAllUserInfo,updateVendorStatus}= require('../Controllers/authcontrollers');
const {authmiddlewares,authorizeRoles}= require('../middlewares/authmiddlewares');
const{Addproduct, getmyProduct, getAllProducts,updateProducts,deleteProduct}= require("../Controllers/productControllers");
const {verifyOtp}= require("../Controllers/verifyOTP");
const {AddToCart,GetCart,RemoveFromCart}= require("../Controllers/cartcontrolletrs");

router.post('/register',register);

//verify otp
router.post('/verify-Otp',verifyOtp);
router.post('/login',login);

//aprove vendor
router.put('/approve-vendor/:id', authmiddlewares, authorizeRoles('Admin'), updateVendorStatus);
router.put('/update-userProfile',authmiddlewares,updateProfile);
router.get('/MyProfileInfo',authmiddlewares,GetMyProfileInfo);
router.get('/getAllUserInfo',authmiddlewares,authorizeRoles('Admin'),getAllUserInfo);
router.delete('/delete-user/:id', authmiddlewares, deleteuser);

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

//add to cart 
router.post('/AddToCart',authmiddlewares,authorizeRoles('Customer'),AddToCart);
//get Cart product details
router.get('/GetCart',authmiddlewares,authorizeRoles('Customer'),GetCart);

router.delete('/remove-item/:productid',authmiddlewares,RemoveFromCart);

module.exports=router;
