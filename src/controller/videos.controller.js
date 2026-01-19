import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const  publishAVideo  = asyncHandler(async(req, res)=>{

    const user  = req.user; 
     if(!user){
        throw new ApiError(404,"invalid request user not found")
     }
     
      
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

const updateVideo  = asyncHandler(async(req,res)=>{

    const {videoId} = req.params;  

     if(!videoId){
      throw new ApiError(404,"videoId is required")
     }

       const oldvideo  = await Video.findById(videoId)
       
    if (!oldvideo) {
     throw new ApiError(404, "Video not found");
   }
    
    //  Ownership check
     
     if(oldvideo.owner.toString() !== req.user._id.toString()){
      throw new ApiError(403, "You are not allowed to update this video");
     }

     const allowedfields = ["title","description"] //This is a whitelist. Only these fields are allowed to be updated.

     const updateFields   = Object.fromEntries(
        Object.entries(req.body).filter(
          ([key,value])=> allowedfields.includes(key) &&
         typeof value === "string" &&
        value.trim() != ""
        )
     )
 
      
       const newthumbnail = req.file?.path;
 
    if(newthumbnail){
         const updatedLink  = await uploadOnCloudinary(newthumbnail)
         if (oldvideo.thumbnail?.public_id) {
                 await deleteOnCloudinary(oldvideo.thumbnail.public_id);
            }
          updateFields.thumbnail = {
               url : updatedLink.secure_url,
               public_id : updatedLink.public_id,
          }
       }

         if (Object.keys(updateFields).length === 0) {
               throw new ApiError(400, "At least one field is required to update");
         }

      const video = await Video.findByIdAndUpdate(
         videoId ,
         {
          $set : updateFields
         },
         {
           new : true
         }
      )

      return res 
      .status(200)
      .json(
        new ApiResponse(200,video,"The fields changed successfully")
      )
})

const deleteVideo = asyncHandler(async(req,res)=>{
    const {videoId} = req.params

    if(!videoId){
      throw new ApiError(404,"the video id is required")
    }

     const video = await Video.findById(videoId)

      if (!video) {
      throw new ApiError(404, "Video not found");
       }


     if(video.owner.toString() !== req.user._id.toString()){
       throw new ApiError(403, "You are not allowed to delete this video")
     }

        console.log("video link of clud ---",video.videoFile?.public_id)

        if (video.videoFile?.public_id) {
    await deleteOnCloudinary(video.videoFile.public_id,"video");
      }

   if (video.thumbnail?.public_id) {
     await deleteOnCloudinary(video.thumbnail.public_id);
   }

        const deletdDocument  = await Video.findByIdAndDelete(videoId);

      if(!deletdDocument){
          throw new ApiError(404,"Error while Deleting the video ")
      }

      return res
      .status(200)
      .json(
         new ApiResponse(200,deletdDocument,"the video deleted successfully")
      )
})

const togglePublishStatus  = asyncHandler(async(req,res)=>{
    const {videoId} = req.params

      if(!videoId){
         throw new ApiError(404,"the id is required")
      }
      console.log(videoId)

   const{isPublished} = req.body
     
     if (typeof isPublished !== "boolean") {
  throw new ApiError(400, "isPublished must be a boolean");
}

     
   const video = await Video.findById(videoId)

   if(!video){
      throw new ApiError(404,"video is not found for this id")
   }

    if(video.owner.toString() !== req.user._id.toString()){
      throw new ApiError(403, "You are not allowed to change the video setting  this video")
    }

    video.isPublished = isPublished
       
     const updatedVideo = await video.save({validateBefore: true})

      if(!updatedVideo){
         throw new ApiError(501,"internal server Error while changing video setting")
      }
      return res
      .status(200)
      .json(
         new ApiResponse(200,updatedVideo,"the video settting is changed successfully ")
      )
})

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 3,
    query,
    userId
  } = req.query;

  // pagination
  const pageNumber = Math.max(Number(page), 1);
  const limitNumber = Math.min(Number(limit), 3);
  const skip = (pageNumber - 1) * limitNumber;

  // filter
  const filter = {};

  if (userId) {
    filter.owner = userId;
  }

  if (query) {
    filter.title = { $regex: query, $options: "i" };
  }
   
   filter.isPublished = true



  // fetch videos
  const videos = await Video.find(filter)
  .populate("owner", "username avatar coverImage")
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limitNumber);

return res.status(200).json(
  new ApiResponse(200, videos, "Videos fetched successfully")
);

});



export  {
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    getAllVideos
}