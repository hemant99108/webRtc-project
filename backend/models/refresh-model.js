const mongoose=require('mongoose');

const refreshSchema=mongoose.Schema({
    token:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{
    timestamps:true,
})


module.exports=mongoose.model('Refresh',refreshSchema,'tokens');