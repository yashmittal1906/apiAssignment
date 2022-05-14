const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User")  
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT
const requireLogin = require('../middleware/requireLogin');

router.put("/api/follow/:id",requireLogin,async (req,res)=> {
    try {
        console.log(req.user.id);
        await User.findByIdAndUpdate(req.params.id,{
        $push: { followers: req.user.id},
        new:true
        })

        await User.findByIdAndUpdate(req.user.id,{
        $push: { following: req.params.id},new:true
        })

        return res.status(200).json({
            message: "Followed Successfully"
        });
    } catch(err) {
        console.log(err);
        return res.status(422).json({error:"Couldn't follow"});
    }
})

router.put("/api/unfollow/:id",requireLogin,async (req,res)=> {
    try {
    await User.findByIdAndUpdate(req.params.id,{
        $pull: { followers: req.user._id.valueOf()}
    })

    await User.findByIdAndUpdate(req.user._id.valueOf(),{
        $pull: { following: req.params.id}
    })

    return res.status(200).json({
        message: "unFollowed Successfully"
    });

    } catch(err) {
        return res.status(422).json({error:"Couldn't follow"});
    }
})


router.get("/api/user", requireLogin, async (req,res) => {
    const user = await User.findById(req.user._id.valueOf());
    console.log(user);
    if(!user)
    return req.status(422).json("No such user exist");
    const result = {
        name:user.name,
        numberOfFollowers: user.followers.length,
        numberOfFollowing: user.following.length,
    }

    res.status(201).json({
        data:result,
        message:"Successfully fetched user data"
    })
})



module.exports = router