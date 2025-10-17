
const express = require("express");
const dirname = require("path");
const fileURLToPath = require("url");
const admin = require("firebase-admin");
const app = express();
const port = 3000;

app.set("view engine","ejs");

app.use(express.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.render("index");
})

const serviceAccount = require("./video-shopping-5ec7b-firebase-adminsdk-fbsvc-f5e869d654.json");admin.initializeApp({
    credential:admin.credential.cert(serviceAccount)
})
const db = admin.firestore();

app.post("/submit", async (req, res) => {
    const { name, email, mes } = req.body; // read from form
    try {
        await db.collection("messages").add({
            name: name,
            email: email,
            message: mes
        });
        res.send("<h1>Submitted successfully</h1>");
    } catch (error) {
        console.error(error);
        res.send("<h1>Failed to submit</h1>");
    }
});

app.listen(port,()=>{
    console.log(`running on the ${port}`);
})