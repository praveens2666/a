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
  accessToken: "sl.u.AGDicyRYhyQbawvPF_QJgtdau2NNCo8t4Tqdu_RYTBKDAEOYz6RcLAJSsTR9t8sgCeKEt_CpfYL4wErqecBbUadL_eym9ByLuoMDTOesAEZyJkWRB5NiYxumjLG4mh3_NEBm2M2nIo0MtKsIyD4Sx2Ie57e09O4xSXcesVNQf0YhL_YAALXtGiWxxSjywmfXtSnBHbvbP5JfoUCIk2965svFT9A3Epr4Hq8V9soqr00yxQxzyE1mU7HrkEskh1B4rmDrwY4yG4VkAfF9NX7_B7jkea7L1hEJ8xuZaBRiE7ywaTdNpJSZz-ay_8_rgaKSQ9TED-sgrP5QXlKS7Xii2Wvzsj2srN1RiI5Op2G4P3cOVRic34XE2tsGht39Cl2Ft_JvZyJ4WghRCKceDKQlQmirOp5FSFveEL3EiHMMmmCx6TpDl_ItZxX4_rvF8kqjEX-ejgpjyT9NCkvfkJQK0bdrPkP-gOoEE4F6jIzUZWsflDFxNvcnFsexQ8uRXhtRlOm8ZsglooA2UKOJNIT4Ue7vEPBYME-Q8Rpedh4D63_To6oM1Eyf6Vg6jYJ9jWEAWX2d2rnlXpYfPdKURkX62quLIJquYw-48czwEwUjoMgFmzBChtC7wvKBASAumMQbtO5R21Atuy6c12-JKcjnU4eegJg9IEMY_iVWupbZSf8g6iJeUOKg9qt2g8CljjqWXPSMwec3y81UxfAqRwF8OxiJNgClQc6Y0sHRNSsfE5MGVKGmSLfyHfg1NQYKs7kLyrmEInLzck6rVWYWeuCPgSVyDKZk2EFgUK7HuLgFHkNx1Py2qbooqLWNvt1EtZNAopExLD0z1mpUi180JsRAvLGEd2mGfNKyk1I9zGIr5kjXnK3gkK6mPQLg2FrVewnMgZXDTM6WREtBaVAkmn-ab5ZW1UT_XWfQdngNonvuE1-XBfuofYMIB0l82H4-oKliBUhNIwfM_1M6al4-3JMxJ9USm6B2HwRQEApkN96jnNFo-s85_88Yuj7HIz8yMVMftzZaosE6e5Z8BcNlKaXAd3j82Le8A4iVxoXVH90zdNdFXMbLPDM-q4EeHf08YpLYuGOQ_wDM8SL2nIeVXhS0A80CiTTXlZeL8clXZs050Wzgbqg9xhF9IwTqKvIr3Hf8h9lTA15_6wJD6Ydu7G27PC0sKSU46Axkyn3VFywYtVpbNNCBwRl6etd9yIfYB2h4yEIYuFwXv5pvUwESc3bmldVEajoPaiVYLAWy-kdoPcZV_HyV1GHeYhQTXEYFJS5kZqRo6r6IY3Tok3bSkDLj_Ovm5jNt0JAO_JKIDZrVJJPErl6_WZ0WRAHv3asGvC_S-eyoB6Dkw-52vCY1z7lQ62ArtOf2DtF3JC81u1-QSywwHYcAYM0tR1nFbFw_hj2zGCFkZrKN_g2KE2rGOuFcGnaJ"
})

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