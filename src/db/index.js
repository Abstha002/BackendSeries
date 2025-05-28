import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"; 

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
        );
        console.log(`\nMONGODB Connected | DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MongoDB Error-:", error.message);
        process.exit(1);
    }
};

export default connectDB;

// This main purpose of this folder is just to connect with database. Async await is compulsory .Remember database is in another country