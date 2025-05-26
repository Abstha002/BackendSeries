import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"; // adjust filename as needed

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

