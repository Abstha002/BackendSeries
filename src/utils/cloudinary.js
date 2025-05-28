import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
   
   // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_API_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });
    

    const uploadOnCloudinary= async function(localFilePath){
        try {
            if(!localFilePath) return null;
            //upload the file on internet
            const response=await cloudinary.uploader.upload(localFilePath,{
                resource_type:auto
            })
            console.log("File is uploaded on cloudinary");
            console.log(response);
            return response;
        } catch (error) {
            //remove the local saved temp file as the upload operation so failed
            fs.unlinkSync(localFilePath)
            console.log(error.message);
            return null;
            
        }
    }

    export default uploadOnCloudinary;