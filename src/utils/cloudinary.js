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
                resource_type:"auto"
            })
            // Remove local file after successful upload
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }
            return response;
        } catch (error) {
            // Remove local file only if it exists
            if (localFilePath && fs.existsSync(localFilePath)) {
                try {
                    fs.unlinkSync(localFilePath);
                } catch (e) {
                    console.log('Failed to delete temp file:', e.message);
                }
            }
            console.log(error.message);
            return null;
        }
    }

    export default uploadOnCloudinary;