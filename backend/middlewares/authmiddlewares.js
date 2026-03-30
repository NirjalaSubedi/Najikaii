const jwt = require('jsonwebtoken');
const authmiddlewares = async (req, res, next)=>{
    try{
        const token = req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({
                message:"token invalid"
            })
        }
        

    }catch(e){

    }
}
exports.module=authmiddlewares;