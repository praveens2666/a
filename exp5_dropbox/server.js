import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs, { access } from "fs";
import multer from "multer";
import { Dropbox } from "dropbox";
const app =express();
const port = 3000;

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");

const upload = multer({dest:"uploads/"});
const dbx = new Dropbox({
  accessToken: "sl.u.AGBc40rO8G4sk-Nw36smcMGwVc0fbyK13BwEmymmCESpSL1PDcoO0UxBmjY7OT35lLuHnpl4GFWTi7VfT53gdr1rSbYLyvy5zI4Ar6ew72u__32Qo6GXqRIVGxcl16kooNnCkhr2yci1_0jjHMrvOgPcq86OjXn-SFanQDSRbjpbBDQ131kfG6J0KX5i2vMxr-TUlO_nP0cxdOU5PMrV_Wc03RLiWwPrIheyX8JTllQlgIhBv_ezoqV1u2Mc6sIUturqXMrw7TzlH6gcJT34xPNMj5U0cmC9XZa0poOrhyyE96tOhu6FzMV63cf2SnIiAWqXdHq73PGjB2gAiIFkR5U3TPs7SgVCqYmVKPTpygambfOGeWxNajpIgfP-rsmYybn_PSInOYpysaQFfB6zQGlwbpld2zttXD-emKkKlSG-gzrHwBQHgSFwZogAFJxKkUKy91KyfWPeUQXJDAhrKzThOS8dnzRevMCR3ksyNlVGAodka038pAS3jTzu52a0MbB2A8FbQONQleH0HTlbGmjvcQWHszKMd1c8HR3hD5s3lZwb5DlcU0V_z4_n2779D-F4T6Phjv3cQIuQZOG7j0U01POg8fE65T7g1blW8mNGIPW9m3WPpJZn_COmc0DOMPkX8npV4ODtFOXo32Kume-s8ou-j_LtiyGsHsd0sVLFcSR8DwTvwDVINKUvccqoWKiQ85ay_IYwIlSNb1YnsAbC0q1YAv_moMUv4mkGKc6D48jRnvNwB0N9zwNo7KjUxwfkI16E6yxH-hI7g43ss5PN10Uyuuq5sVBsnQ8EauWdx6Lc6gMDriU75n0fb-H-zotLDdxgxT_oHdRDG6VcYhTazbBG-EeZ0nSZDjF1Tjo7tCB2ZD47dokyRpBnB_YoGhmJg5ijMREodZDjYHk4Ut2WLUt2BNDA-6ZPUf1dmCTQ-Oc_Qp3o42Kmy99lSaJ5HlZxk5XwOvUmBjALMhAQsC5ElawkjAHGdw838IQ_1-cvgLkGYB9TIKKNX7jB7LGcnocAKJa-2Cmz5EtORv0aftWgr8JRiYHratxKusLm1al4FZyAMDVuh6U0aSHak7cY7b0eYMtIoMBWuniWXDjpH2QQOhRpEWkNNdLz0wG9n97uyBnF4pVzEANipJUkUWCd4C4E1QoQ5dmQOTn5Hz4tg7jo-Cq9kwIey6v9G6X5elj0IHJexDtQHtxZw0y9nHhzYsMImQojCuO_rXUeBZ7gBeBlfzc2un13BudS5hrhAwzswUnKQDORpD1hHNm-w2URg7c44uTLmSrmcq1FTNyJLe8V9PjhTaaT8DaRNf9E0b5O8Ff8Ck0S06_F_zYOo5mHHZnHFCHdUZWnJbIA_o2ewJemDlz5HR3IrQKEAl8XAGMCi8ybevK3xrRQhrVH3PdEy7zLio5Jk1oYBNPsVQ0LCsVK", // 🔹 Replace with your token
});


app.get("/",async(req,res)=>{
    try{
        const data = await dbx.filesListFolder({path:""});
        res.render("index",{files : data.result.entries});
    }catch(err){
        res.render("index",{files:[]});
    }
})

app.post("/upload",upload.single("file"),async(req,res)=>{
    try {
        const data = fs.readFileSync(req.file.path);
        const path = `/${req.file.originalname}`;

        await dbx.filesUpload({path:path,contents:data,mode:'overwrite'});
        fs.unlinkSync(req.file.path);
        res.redirect("/");
    } catch (error) {
        res.send("Error uploading the files");
    }
})

app.get("/download/:name",async(req,res)=>{
    try {
        const filename = req.params.name;
        const data = await dbx.filesDownload({path :`/${filename}`});
        res.send(Buffer.from(data.result.fileBinary));
    } catch (error) {
        res.send("error downloading the file");
    }
})

app.listen(port,()=>{
    console.log(`Running on the port ${port}`);
})