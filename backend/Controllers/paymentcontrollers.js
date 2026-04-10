const crypto = require('crypto');

exports.esewaPayment= async (req,res)=>{
    try{

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}