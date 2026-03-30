const express =require('express');
const router= express.Router();
const {register,login}= require('../Controllers/authcontrollers');
const {authmiddlewares}= require('../middlewares/authmiddlewares');

router.post('/register',register);
router.post('/login',login);
router.get('/test',authmiddlewares,(req,res)=>{
    res.status(200).json({
        success:"true",
        message:"token validate successfull",
        user:req.user
    })
});

module.exports=router;
