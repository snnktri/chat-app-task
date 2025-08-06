//image uploade

import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';

console.log("name: ", process.env.CLOUD_NAME)

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME || "",
    api_key: process.env.CLOUD_API_KAY || "",
    api_secret: process.env.CLOUD_API_SECRET || ""
});

interface CloudinaryReponse {
    url: string;
    secure_url: string;
    public_id: string;
    [key: string]: any
}



export const uploadeCloudinary = async(
    localFilePath: string,
): Promise<CloudinaryReponse | null> => {
    try {
        // console.log("name: ", process.env.CLOUD_NAME)
        if(!localFilePath) return null;

        

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "chat"
        });

        console.log("Image uplaode successfully: ", response?.url);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error: any) {
        fs.unlinkSync(localFilePath)
        console.error("Error on uploading image to cloudinary:", error?.message);
        return null;
    }
}

