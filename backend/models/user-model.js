const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({

    phone:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:false,
    },
    avatar:{type:String, required:false},
    activated:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

module.exports=mongoose.model('User',userSchema);