const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT;
const mongoose = require('mongoose')
const User = mongoose.model("User")
const { promisify } = require('util');

module.exports = async (req,res,next)=>{
    const {authorization} = req.headers
    if(!authorization){
       return res.status(401).json({error:"you must be logged in"})
    }
    const token = authorization.replace("Bearer ","");  
    
    const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT
    );

    User.findById(decoded.id).then(userdata=>{
        req.user = userdata
        // console.log(payload);
        next()       
    })
}
