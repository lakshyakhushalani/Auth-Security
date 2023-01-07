const express=require("express");
const ejs=require("ejs");
const bodyparser=require("body-parser");
const mongoose=require("mongoose");
const  encrypt=require('mongoose-encryption');
require("dotenv").config();
const app=express();
const Schema=mongoose.Schema;

console.log(process.env.API_KEY);

mongoose.set('strictQuery', true)

app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));

//DB connection
mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser:true});

//Schema define
const xxx=new Schema(
  {
    email:String,
    password:String
  }
)

//encrypting password  --this must be done beofre making a collection using mongoose.model
xxx.plugin(encrypt,{ secret:process.env.SECRET, encryptedFields : ["password"] });

//making collection
const users=new mongoose.model("users",xxx);

app.set("view engine","ejs");

app.get("/",(req,res)=>{
  res.render("home");
})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.get("/register",(req,res)=>{
    res.render("register");
})

app.post("/register",(req,res)=>{
  const Email=req.body.username;
  const Password=req.body.password;

  const newuser=new users({
    email:Email,
    password:Password
  });
  newuser.save( (err)=>{
    if(err) res.send("Not Register");
    else res.render("secrets");
  } )

})

app.post("/login",(req,res)=>{
  const Email=req.body.username;
  const Password=req.body.password;


  users.findOne({email:Email},(err,found)=>{
    if(err) console.log(err);
    else
     {
        if(found){if(found.password===Password) res.render("secrets");
        else res.send("Incorrect Password");}
     }
  })
})

app.listen(3000,"localhost",()=>{console.log("server is listening to the port 3000");});