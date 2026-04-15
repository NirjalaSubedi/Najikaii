const express =require('express');
const router= express.Router();
const {authmiddlewares,authorizeRoles}= require('../middlewares/authmiddlewares');
const {PlaceOrder,getorders,UpdateOrderStatus,CancelOrder}=require('../Controllers/ordercontrollers');

router.post('/placeorder',authmiddlewares,authorizeRoles('Customer'),PlaceOrder);
router.get('/vieworders',authmiddlewares,authorizeRoles('Customer','Admin','Vendor'),getorders);
// Status update ko lagi
router.put('/update-status/:orderId', authmiddlewares, authorizeRoles('admin', 'vendor', 'Admin', 'Vendor'), UpdateOrderStatus);

// Cancel ko lagi
router.put('/cancel/:orderId', authmiddlewares, authorizeRoles('Customer', 'admin', 'Admin'), CancelOrder);
module.exports=router;
