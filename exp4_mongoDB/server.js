import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bodyParser from "body-parser";
const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb+srv://spraveen2666:PRaV-1234@tcebus.8ailfz6.mongodb.net/?retryWrites=true&w=majority&appName=TceBus")
.then(()=>{console.log("Mongoo DB Connected")})
.catch(err=>console.log(err));

var schema = new mongoose.Schema({
    name : String,
    roll : String,
    date : String,
    status : String
});

var att = mongoose.model("att",schema);

app.get("/",async(req,res)=>{
    const data = await att.find();
    res.render("index",{users:data});
})

app.post("/submit",async(req,res)=>{
    const data = new att(req.body);
    await data.save();
    res.redirect("/");
})

app.get("/edit/:id",async(req,res)=>{
    const user = await att.findById(req.params.id);
    res.render("edit",{user});
})

app.post("/edit/:id",async(req,res)=>{
    await att.findByIdAndUpdate(req.params.id,req.body);
    res.redirect("/");
})

app.get("/delete/:id",async(req,res)=>{
    await att.findByIdAndDelete(req.params.id);
    res.redirect("/");
})

app.listen(port,()=>{
    console.log(`Running on the port ${port}`);
})