//jshint esversion:6
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app=express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/usersDB",{useNewUrlParser:true});

const userSchema=new mongoose.Schema(
  {
    email:String,
    password:String
  });
  const secret = "Thisisourlittlesecret.";
  userSchema.plugin(encrypt,{secret:secret, encryptedFields: ["password"]} );

const User= new mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.get("/secrets",function(req,res){
  res.render("secrets");
});

app.get("/submit",function(req,res){
  res.render("submit");
});

app.post("/register",function(req,res){
  const registerUser= new User({
    email:req.body.username,
    password:req.body.password
  });
  registerUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});

app.post("/login",function(req,res){
  const username=req.body.username;
  const password=req.body.password;
  User.findOne({email:username},function(err,foundUser){
    if(err){
      res.send(err);
    }else{
      if(foundUser.password === password){
        res.render("secrets");
      }else{
        res.send("invalid credantials");
      }
    }
  });
});


app.listen(3000,function(){
  console.log("Server started successfully at port 3000");
});
