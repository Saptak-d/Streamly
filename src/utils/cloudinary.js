import { v2  as cloudinary} from "cloudinary";

import fs from "fs";
import { ApiError } from "./ApiErrors.js"



cloudinary.config({
    cloud_name :process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET 
})



const uploadOnCloudinary  = async(localFilePath)=>{
    try {
        if(!localFilePath) return null

         const fixedPath = localFilePath.replace(/\\/g, "/");

        //upload the file on cloudinary
     const response =  await  cloudinary.uploader.upload(fixedPath,{
            resource_type : "auto"
        })
            //file has been uploaded successfull
            // console.log("ile is uploded on cloudinary",response.url)
            fs.unlinkSync(fixedPath)
            return response

    } catch (error) {
        console.log("Cloudinary error:", error);
        fs.unlinkSync(localFilePath)
        console.log("Files is removed automatically") //remove the locally saved temporary file as the as the upload operation got failed 
    }
}

const deleteOnCloudinary = async(public_id,resource_type = "image")=>{
    try {
        if(!public_id){
            return null
        }
        const response = await cloudinary.uploader.destroy(public_id,{resource_type});

        if(response.result !== "ok" && response.result !== "not found"){
            throw new ApiError(500,"Some Internal server error ")
        }

        return response
        
    } catch (error) {
              console.log("Cloudinary error:", error);
    }
}

export {uploadOnCloudinary, deleteOnCloudinary};