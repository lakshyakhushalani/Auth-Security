const express=require("express");
const ejs=require("ejs");
const bodyparser=require("body-parser");
const mongoose=require("mongoose");
const  encrypt=require('mongoose-encryption');
const bcrypt=require("bcrypt");
require("dotenv").config();
const app=express();
const Schema=mongoose.Schema;


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


const salt_rounds=12;
app.post("/register",(req,res)=>{
  const Email=req.body.username;
  const Password=req.body.password;

  bcrypt.hash(Password,salt_rounds,(err,hashed_password)=>{
    const newuser=new users({
      email:Email,
      password:hashed_password
    });
    newuser.save( (err)=>{
      if(err) res.send("Not Register");
      else res.render("secrets");
    } )
  });

});

app.post("/login",(req,res)=>{
  const Email=req.body.username;
  const Password=req.body.password;


  users.findOne({email:Email},(err,found)=>{
    if(err) console.log(err);
    else
     {
        bcrypt.compare(Password,found.password,(err,response)=>{
          if(err) res.send("Password incorrect");
          else res.render("secrets");
        })
     }
  })
})

app.listen(3000,"localhost",()=>{console.log("server is listening to the port 3000");});