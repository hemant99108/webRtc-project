const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({

    phone:{
        type:String,
        required:true,
        unique:true
    },
    activated:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

module.exports=mongoose.model('User',userSchema);