import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
 
const app=express();

//Configuring the cors
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

//This is for when people submit the form they submit json report)
app.use(express.json({limit:"16Kb"}))
//urlencoded is for query string and extended true simply means nested statement in query string itself
app.use(express.urlencoded({extended:true,limit:"16Kb"}))
//Static is used to serve static files 
app.use(express.static('public'));

//cookies parser
app.use(cookieParser());


//routes 
import UserRoute from "./routes/user.routes.js"; 

app.use("/api/v1/users",UserRoute)



export default app;

