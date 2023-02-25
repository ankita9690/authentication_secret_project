//jshint esversion:6

require("dotenv").config();
//const md5=require("md5");
const mongoose=require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const encrypt=require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1:27017/secretdb",{useNewUrlParser:true});
//  [localhost] was replace by [127.0.0.1] because of udpdated version of nodejs

const secretschema=new mongoose.Schema({
  email:String,
  password:String
});
const mysecrete=process.env.SECRET;
secretschema.plugin(encrypt,{ secret:mysecrete, encryptedFields: ["password"] } );


const secretcols=new mongoose.model("secretcols",secretschema);

app.get("/",function(req,res){
  res.render("home");
});
app.get("/register",function(req,res){
  res.render("register");
});
app.get("/login",function(req,res){
  res.render("login");
});
app.get("/secrets",function(req,res){
  res.render("secrets");
});

app.post("/register",function(req,res){
  const regusername=req.body.username;
  const regpassword=req.body.password;
  // const regpassword=md5(req.body.password);
    const user=new secretcols({
      email:regusername,
      password:regpassword
      });
    user.save(function(err){
      if(!err){
        console.log("successfully saved");
      }
    });
  res.redirect("/secrets");
});

app.post("/login",function(req,res){
  const logusername=req.body.username;
  const logpassword=req.body.password;
  // const logpassword=md5(req.body.password);
  secretcols.findOne({email:logusername},function(err,found){
    if(err){
      console.log("login error");
    }else{
      if(found){
        if(found.password===logpassword){
          console.log("password matched");
        }else{
          console.log("incorrect password");
        }
      }else{
        console.log("invalid user");
      }
    }
  });
  res.redirect("/secrets");
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
