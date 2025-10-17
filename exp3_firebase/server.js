const express = require("express");
const admin = require("firebase-admin");
const path = require("path");
const app = express();
const port = 3000;

// Set EJS view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

// Initialize Firebase
const serviceAccount = require("./video-shopping-5ec7b-firebase-adminsdk-fbsvc-daa4bdee5d.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
const collectionRef = db.collection("messages");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/submit", async (req, res) => {
  const { name, email, mes } = req.body;
  try {
    await collectionRef.add({ name:name, email:email, message:mes });
    res.redirect("/list");
  } catch (err) {
    res.send(" Error adding data");
  }
});


app.get("/list", async (req, res) => {
  const snapshot = await collectionRef.get();
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.render("list", { data });
});

app.get("/edit/:id", async (req, res) => {
  const doc = await collectionRef.doc(req.params.id).get();
  res.render("edit", { id: req.params.id, data: doc.data() });
});


app.post("/update/:id", async (req, res) => {
  const { name, email, message } = req.body;
  await collectionRef.doc(req.params.id).update({ name, email, message });
  res.redirect("/list");
});


app.get("/delete/:id", async (req, res) => {
  await collectionRef.doc(req.params.id).delete();
  res.redirect("/list");
});

app.listen(port, () => {
  console.log(` Running on http://localhost:${port}`);
});
