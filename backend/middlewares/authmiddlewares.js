const jwt = require('jsonwebtoken');
const authmiddlewares = async (req, res, next)=>{
    try{
        const token = req.headers.authorization?.split(" ")[1];

    }catch(e){

    }
}
exports.module=authmiddlewares;