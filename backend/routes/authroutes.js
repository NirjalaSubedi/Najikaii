const express =require('express');
const router= express.Router();
const {register,login}= require('../Controllers/authcontrollers');
const {authmiddlewares}= require('../middlewares/authmiddlewares');

router.post('/register',register);
router.post('/login',login);
router.get('/test',authmiddlewares);

module.exports=router;
