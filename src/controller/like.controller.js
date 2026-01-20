
import { Like } from "../models/like.models";
import { Video } from "../models/video.models";
import { ApiError } from "../utils/ApiErrors";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";


const toggleVideoLike  = asyncHandler(async(req , res)=>{
    const {videoId} = req.params
    if(!videoId){
        throw new ApiError(400,"the video id is required")
    }
    const userId  = req.user?._id
    
    if(!userId){
        throw new ApiError(400,"the user is need to login fisrt")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404,"no video is found in this  ID ")
    }

    const existUserOrNot = await Link.find({video : videoId ,likedBy : userId})

    if(existUserOrNot.length > 0){
        const deletedLike = await Like.deleteOne({video : videoId , likedBy : userId})
        if(deletedLike.deletedCount == 0){
            throw new ApiError(404,"the like is already deleted")
        }
        return res
         .status(200)
         .json(
            new ApiResponse(200,deletedLike,"the like is successfully deleted")
         )
    }

     if(video.owner.equals(userId)){
        throw new ApiError(404,"user cant like his or her own video ")
     }

    const newlike = await Like.create({
        video : videoId,
        likedBy : userId
    });

    if(!newlike){
        throw new ApiError(500,"Error while creating the like")
    }
    
    return res
     .status(200)
     .json(
        new ApiResponse(200,newlike,"the like is successfully created")
     )

});

export {
    toggleVideoLike,
    
}