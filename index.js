const express=require('express');
const app=express();
const bodyparser=require('body-parser');
const ejs=require('ejs');
const url=require('./setup/myUrls').url;
const path=require('path');
const mongoose=require('mongoose');
const multer=require('multer');
const fs=require('fs');
mongoose.connect(url,{useNewUrlParser:true})
.then(()=>console.log('mongodb successfully connected'))
.catch((err)=>console.log(err));
const Image=require("./models/ImageU");
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.set('views',__dirname+"/"+"views");
app.set('view engine','ejs');
app.use(express.static('./public'));
const Storage=multer.diskStorage(
    {
        destination:function(req,file,cb)
        {
            cb(null,'./public/upload');
        },
        filename:function(req,file,cb)
        {
            cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));
        }
    })
const upload=multer(
    {
        storage:Storage
    }).single('testimage');
//single image indicate uploading a image one by one

app.get('/',(req,res)=>
{
    res.render("index");
})
app.get('/imageup',(req,res)=>
{
    res.render('uploader');
})
app.post('/save',(req,res)=>
{
    upload(req,res,(err)=>{
        if(err)
        {
            console.log(err);
            res.redirect("/");
        }
        else
        {
            newImage=new Image(
                {
                    name:req.body.name,
                    image:
                    {
                        data:fs.readFileSync(path.join(__dirname + '/public/upload/' + req.file.filename)),
                        contentType:'image/jpg'
                    }
                })
                newImage.save()
                .then(()=>
                {
                    res.render("uploader",
                    {
                        message:"Successfully uploaded the file",
                        imagename:`upload/${req.file.filename}`
                    })
                })
                .catch(err=>console.log(err));
        }
    })

})
app.get('/getpics',(req,res)=>
{
    Image.find()
    .then(img=>
        {
            if(img)
            {
             
                res.render('getall',{images:img});
            }
            else
            {
                res.redirect('/');
            }
        })
    .catch(err=>console.log(err));
})
app.listen(3000,()=>console.log("server is running on 3000"));