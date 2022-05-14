const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const port = process.env.PORT;
const MONGOURI = process.env.URL;

mongoose.connect(MONGOURI,{
  useNewUrlParser:true,
  useUnifiedTopology: true
})

mongoose.connection.on('connected',()=>{
  console.log("Connected to server");
})

mongoose.connection.on('error',(err)=>{
  console.log("Error:",err);
})

require("./models/user");
require("./models/post");
require("./models/comment");


app.use(express.json());
app.use(require("./api/auth"));
app.use(require("./api/user"));
app.use(require("./api/post"));


app.listen(port,() => {
  console.log("Server is running on",port);
})
