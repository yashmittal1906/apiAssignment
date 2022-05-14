const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User"); 
const Post = mongoose.model("Post");
const Comment = mongoose.model("Comment");
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT
const requireLogin = require('../middleware/requireLogin');


router.post("/api/posts", requireLogin, async (req,res) => {
   const {title, description} = req.body;
   if(!title || !description)
   {
       return res.status(422).json("Enter all the details")
   }
   try {
        const post = await Post.create({
            title,
            description,
            postedBy: req.user._id.valueOf()
        })
    const result = {
        postId: post.id,
        Title:post.title,
        Description: post.description,
        CreatedTime: post.createdAt
    }
    return res.status(201).json({
        status: "Successful",
        data:result
    })
   } catch(err) {
       return res.status(422).json({error:"Couldn't create post"});
   }

})

router.delete("/api/posts/:id", requireLogin, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(this.toString(post.postedBy)!==this.toString(req.user._id))
        {
           return res.status(422).json({error: "This post was created by some other user"});
        }
        await post.delete();
        return res.status(201).json({
            status: "Successful"
        })
    } catch(err) {
        return res.status(422).json({error: "Couldn't delete the post"});
    }
})

router.put("/api/like/:id", requireLogin, async (req,res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id,{
            $push: {likes: req.user.id}
        },{
            new: true
        });
        
        return res.status(201).json({
            status: "Successful"
        })
    } catch(err) {
        return res.status(422).json({error: "Couldn't like the post"});
    }
})

router.put("/api/unlike/:id", requireLogin, async (req,res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id,{
            $pull: {likes: req.user._id}
        },{
            new: true
        });
        
        return res.status(201).json({
            status: "Successful"
        })
    } catch(err) {
        return res.status(422).json({error: "Couldn't unlike the post"});
    }
})

router.put("/api/comment/:id", requireLogin, async (req,res) => {
    try {
        const {comment} = req.body;

        const comments = await Comment.create({
            comment,
            postedBy:req.user._id,
            post: req.params.id
        })
        
        return res.status(201).json({
            status: "Successful",
            data: comments.id
        })
    } catch(err) {
        return res.status(422).json({error: "Couldn't comment on the post"});
    }
})

router.get("/api/posts/:id", requireLogin, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        const comments = await Comment.find({post:post.id});
        const result = {
            post,
            numberOfLikes:post.likes.length,
            comments
        }
        return res.status(201).json({
            status: "Successful",
            data: result
        })
    } catch(err) {
        return res.status(422).json({error: "Couldn't get the post"});
    }
})

router.get("/api/all_posts", requireLogin, async (req,res) => {
    try {
        const post = await Post.find({postedBy:req.user._id});
        return res.status(201).json({
            status: "Successful",
            data: post
        })
    } catch(err) {
        return res.status(422).json({error: "Couldn't get all the post"});
    }
})



module.exports = router;