const express =require('express');
const router= express.Router();
const {authmiddlewares,authorizeRoles}= require('../middlewares/authmiddlewares');
const {PlaceOrder,getorders}=require('../Controllers/ordercontrollers');

router.post('/placeorder',authmiddlewares,authorizeRoles('Customer'),PlaceOrder);
router.get('/vieworders',authmiddlewares,authorizeRoles('Customer','admin','vendor'),getorders)

module.exports=router;
