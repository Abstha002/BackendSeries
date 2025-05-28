import dotenv from 'dotenv'
import connectDB from "./db/index.js"; // extension is must 
import app from './app.js';

// Configuring dotenv package

dotenv.config(
    {
        path:'.env'
    }
)

// This connects to the database why then and catch because async and await alway returns promise

connectDB()
.then(()=>{
    app.listen(process.env.PORT ||8000,()=>{
    console.log(`listening on ${process.env.PORT}`);
})
})
.catch((error)=>{
    console.log("MongoDB Error:-", error);
    
})

/*
This is way for connecting with the database on method inside index.js only 

import mongoose from "mongoose";
import { DB_NAME } from "./constant";

const app=express();
;(async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("Error",(error)=>{
            console.log("Error",error);
            throw error 
        })
        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on ${process.env.PORT}`)
        });
    }catch(error){
        console.error("Error :",error);
        throw error
    }
})()
*/
