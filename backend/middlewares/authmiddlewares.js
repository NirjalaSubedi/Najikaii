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
        console.log("loged in user data:",decoded);
        
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
        console.log("Allowed Roles:", roles); 
        console.log("User Role:", req.user.role);

        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                message:`Role (${req.user.role}) not allowed to use this resources`,
            })
        }
        next();
    }
}
module.exports={authmiddlewares,authorizeRoles};