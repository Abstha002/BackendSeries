import dotenv from 'dotenv'
import express from "express"
import connectDB from "./db/index.js";

dotenv.config(
    {
        path:'.env'
    }
)
connectDB();

/*
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
