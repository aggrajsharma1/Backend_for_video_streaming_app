import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // upload File on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        // after File upload 
        console.log("File Uploaded Successfully", response)
        fs.unlinkSync(localFilePath)
        return response

    } catch (error) {

        // deletion of file from local server
        fs.unlinkSync(localFilePath)
        
        return null
    }
}

export { uploadOnCloudinary }