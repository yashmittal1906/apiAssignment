const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  likes:[{type:ObjectId,ref:"User"}],
  postedBy: {type:ObjectId,ref:"User"},
  createdAt:{
    type:Date,
    default:Date.now()
  }
})

mongoose.model("Post",postSchema);
