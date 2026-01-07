import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const  publishAVideo  = asyncHandler(async(req, res)=>{

    const user  = req.user; 

     if(!user){
        throw new ApiError(404,"invalid request user not found")
     }
     console.log("FILES:", req.files);

      
     const videoLocalPath = req.files?.videoFile[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path
    console.log("videoLocalPath-----",videoLocalPath)
    
    if(!videoLocalPath || !thumbnailLocalPath){
        throw new ApiError(404,"video and thumbnail both are required ")
    }
    const {title , description , isPublished } = req.body;

     if(!title ||  !description  || isPublished === "undefined"){
        throw new ApiError(404,"title , description , isPublished  all this fields are required")
     }

       const existVideo = await Video.findOne({owner : user._id, title })

       if( existVideo){
        throw new ApiError(404,"The User already has a same video title exist")
       }

     const video = await uploadOnCloudinary(videoLocalPath)
     const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
      console.log("video--",video,)

      console.log("video.secure_url----",video.secure_url)
      console.log("video.public_id----",video.public_id )
      console.log("video.duration----",video.duration)

     if(!video.secure_url || !video.public_id || !video.duration || !thumbnail.secure_url || !thumbnail.public_id){
          throw new ApiError(400,"Error while uploading the video or Thumbnail ")
     }

     const uploadedVideoInfo  = await  Video.create({

        videoFile : {
            url : video.secure_url,
            public_id : video.public_id
        },
        thumbnail : {
            url : thumbnail.secure_url,
            public_id : thumbnail.public_id
        },
        title,
        description,
        duration : video.duration,
        isPublished,
        owner : user._id
     })

     return res
    .status(200)
    .json(
        new ApiResponse(200,uploadedVideoInfo,"The video and Thumbnil is uploaded successfully")
    )

})

const getVideoById  = asyncHandler(async(req,res)=>{
     const user = req.user
     if(!user){
        throw new ApiError(400,"unauthorized request")
     }
      const { videoId } = req.params

      if(!videoId){
        throw new ApiError(400,"the videoId is required")
      }
       
       const video  = await Video.findById({_id : videoId});

       if(!video){
         throw new ApiError(404,"No video exist")
       }

       return res
       .status(200)
       .json(
          new ApiResponse(200,video,"the video returned successfully")
       )
})

export  {
    publishAVideo,
    getVideoById
}