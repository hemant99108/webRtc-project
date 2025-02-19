require('dotenv').config();
const express =require('express');
const app=express();
const router=require('./routes');
app.use(express.json());
const dbconnect=require('./database');
const cors=require('cors');

const corsOption={
    origin:['http://localhost:3000'],
    credentials:true,
}

app.use(cors(corsOption));

const PORT=process.env.PORT || 5000;
app.use(router);

app.get('/',(req,res)=>{
    res.send(' hello from express');
})

dbconnect();
app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`));