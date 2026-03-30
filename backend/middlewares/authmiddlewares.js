const jwt = require('jsonwebtoken');
const authmiddlewares = async (req, res, next)=>{
    try{
        const token = req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({
                message:"token invalid"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user=decoded;
        next();

    }catch(e){
        res.status(500).json({
            message:e.message
        })
    }
}

const authorizeRoles= (...roles)=>{
    return(req,res,next)=>{
        if(roles.includes(req.user.roles)){
            return res.status(403).json({
                message:`Role (${req.user.roles}) not allowed to use this resources`,
            })
        }
        next();
    }
}
module.exports={authmiddlewares,authorizeRoles};