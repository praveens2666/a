import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.set("view engine","ejs");

app.get("/",async(req,res)=>{
    
    try {
        const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
       const joke = response.data;
       res.render("index",{joke});
    } catch (error) {
        console.log(error);
        res.render("index",{joke: null});
    }
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})