const  mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/ytRegistration")
.then(()=>{
    console.log("Connection established with Database");
}).catch((e)=>{
    console.log("No connection");
})