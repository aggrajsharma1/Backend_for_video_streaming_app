import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const updateFileOnCloudinary = async (localFilePath, fileToDestroy) => {
    try {
        if (!localFilePath) return null;

        // destroy file from cloudinary
        await cloudinary.uploader.destroy(fileToDestroy, {
            resource_type: "auto"
        })

        // upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        // deleting file from local server
        fs.unlinkSync(localFilePath)

        return response
    } catch (error) {

        // deleting file from local server
        fs.unlinkSync(localFilePath)
        return null
    }
}

export { updateFileOnCloudinary }