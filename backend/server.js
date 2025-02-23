require('dotenv').config();
const express =require('express');
const app=express();
const router=require('./routes');
app.use(express.json());
const dbconnect=require('./database');
const cors=require('cors');
const cookieParser=require('cookie-parser'); 
const bodyParser=require('body-parser');

app.use(cookieParser()); 
 
const corsOption={
    origin:['http://localhost:3000'], 
    credentials:true,
}
app.use('/storage',express.static('storage'));

app.use(cors(corsOption));
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
const PORT=process.env.PORT || 5000;
app.use(router);


app.get('/',(req,res)=>{
    res.send(' hello from express');
});

dbconnect();
app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`));