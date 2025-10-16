import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

const books = [{id:1,name:"interstellar",author:"christopher nolan"}];

app.get("/",(req,res)=>{
    res.send("Hello World");
})

app.get("/list",(req,res)=>{
    res.json(books);
})

app.post("/add",(req,res)=>{
    const {name,author} = req.body;
    if(!name || !author){
        console.log("name or author is required field to add");
        return;
    }
    books.push({id:books.length+1,name:name,author:author});
    res.send("Book Added");
})

app.put("/update/:id",(req,res)=>{
    const id = parseInt(req.params.id);
    const book = books.find(b=>b.id==id);
    if(id==-1){
        res.send("book not available as id is -1");
    }
    const {name,author} = req.body;
    if(name)book.name = name;
    if(author)book.author = author;;
    res.send("Book Updated");
})

app.delete("/delete/:id",(req,res)=>{
    const id = parseInt(req.params.id);
    if(id==-1){
        res.send("Book cannot be deleted as id is -1");
        return;
    }
    const book = books.find(b=>b.id==id);
    books.splice(book,1);
    res.send("Book deleted");
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})