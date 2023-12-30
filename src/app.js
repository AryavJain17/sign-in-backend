require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
require("./db/conn"); 
app.use(express.json());
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

app.use(bodyParser.urlencoded({ extended: true }));
const Register = require("./models/registers");
const port = process.env.PORT || 3000;
const staticPath = path.join(__dirname,"../public");
const template_path = path.join(__dirname,"../templates/views");
const partialsPath = path.join(__dirname,"../templates/partials");


app.use(express.static(staticPath));
app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partialsPath);
app.get("/",(req,res)=>{
    res.render("index");
})
app.get("/register",(req,res)=>{
    res.render("register")
})
app.get("/login",(req,res)=>{
    res.render("login")
})


app.post("/register",async(req,res)=>{
    try{
        // console.log("Received registration request:", req.body);
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;

    if(password===confirmpassword){
        const employeeRegister = new Register({
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            email:req.body.email,
            gender:req.body.gender,
            phone:req.body.phone,
            age:req.body.age,
            password:password,
            confirmpassword:confirmpassword

        })

        const token = await employeeRegister.generateAuthToken();
        console.log("token is"+ token);
        const registered = await employeeRegister.save();
        res.status(201).render("index");
    }else{
        res.send("Password are not matching")
    }
}catch (err) {
    console.error(err);
    res.status(400).send(`Error during registration: ${err.message}`);
}
})

app.post("/login", async (req,res)=>{
    try{
    const email = req.body.email;
    const password = req.body.password;

    const userMail = await Register.findOne({email:email});
    const isMatch = await bcrypt.compare(password,userMail.password);
    const token = await userMail.generateAuthToken();
    console.log("token is"+ token);
    if(isMatch){
        res.status(201).render("index");
    }else{
        res.send("Email or password not matching");
    }
}catch(err){
    res.status(400).send("Invalid email");
}

})
app.listen(port, ()=>{
    console.log(`Connection established with port ${port}`);
})