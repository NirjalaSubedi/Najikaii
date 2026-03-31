const express =require('express');
const router= express.Router();
const {register,login}= require('../Controllers/authcontrollers');
const {authmiddlewares,authorizeRoles}= require('../middlewares/authmiddlewares');

router.post('/register',register);
router.post('/login',login);
router.get('/test',authmiddlewares,(req,res)=>{
    res.status(200).json({
        success:"true",
        message:"token validate successfull",
        user:req.user
    })
});

router.get('/add-product',authmiddlewares,authorizeRoles('Vendor'),(req,res)=>{
    if(req.user.roles==='Vendor'){
    return res.status(200).json({
        message:"product haalna milo"
    })
    }
    return res.status(403).json({
        message:"product haalna mildaiina"
    })
});

module.exports=router;
