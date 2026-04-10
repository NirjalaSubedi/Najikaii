const express =require('express');
const router= express.Router();
const {authmiddlewares,authorizeRoles}= require('../middlewares/authmiddlewares');
const {PlaceOrder}=require('../Controllers/ordercontrollers');

router.post('/placeorder',authmiddlewares,authorizeRoles('Customer'),PlaceOrder);

module.exports=router;
