const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User")    
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT
const requireLogin = require('../middleware/requireLogin')



router.post("/api/signup",async (req,res)=>{
  try {
  const {name,email,password}=req.body;
  if(!name || !email || !password)
  {
     return res.status(422).json({error:"please add all the fields"});
  }
  const isUserExist = await User.findOne({email:email});
  if(isUserExist)
  {
     return res.status(422).json({error:"User already exist"});
  }
  const hashedPassword = await bcrypt.hash(password,12);
  const user = await User.create({
    name,
    email,
    password:hashedPassword
  })
  const token = jwt.sign({id: user._id},process.env.JWT,{expiresIn: '24h'});

  res.status(201).json({
    status:"Successful",
    message:"Sign up Successful",
    user,
    token
  });
} catch(err) {
  console.log(err);
   return res.status(422).json({error:"Couldn't sign up",err});
}
})


router.post("/api/authenticate",async (req,res)=>{
  try {
  const {email,password}=req.body;
  if(!email || !password)
  {
     return res.status(422).json({error:"please add all the fields"});
  }
  const user = await User.findOne({email:email});
  if(!user)
  {
     return res.status(422).json({error:"Wrong credentials"});
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(422).json({error:"Wrong credentials"});
  }

  const token = jwt.sign({id: user._id},process.env.JWT,{expiresIn: '24h'});
    res.status(201).json({
    status:"Successful",
    message:"Sign in Successful",
    user,
    token
  });
} catch(err) {
  console.log(err)
   return res.status(422).json({error:"Couldn't Login"});
}
})


module.exports = router;

//"_id": "627f9096eb999defd88a66c4"