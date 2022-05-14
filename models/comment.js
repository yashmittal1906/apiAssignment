const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const commentSchema = new mongoose.Schema({
  comment:{
     type:String,
     required: true
  },
  postedBy: {type:ObjectId,ref:"User"},
  post:{type:ObjectId,ref:"Post"},
  createdAt:{
    type:Date,
    default:Date.now()
  }
})

mongoose.model("Comment",commentSchema);