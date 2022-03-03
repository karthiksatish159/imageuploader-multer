const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const ImageSchema=new Schema(
    {
        name:{
            type:String
        },
        image:
        {
            data:Buffer,
            contentType:String
        }
    })
module.exports=imageModel=mongoose.model("Imagemodel",ImageSchema);