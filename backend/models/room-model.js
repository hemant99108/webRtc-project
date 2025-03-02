const mongoose=require('mongoose');


const roomSchema=new mongoose.Schema({
    topic:{
        type:String,
        required:true
    },
    roomType:{
        type:String,
        required:true

    },
    ownerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    speakers:{
        type:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'User', 
            },
        ],
    }

},{timestamps:true});


module.exports=mongoose.model('Room',roomSchema);