
import { Like } from "../models/like.models.js";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.models.js";


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

    const existUserOrNot = await Like.find({video : videoId ,likedBy : userId})

    if(existUserOrNot.length > 0){
        const deletedLikeFromVIdeo = await Like.deleteOne({video : videoId , likedBy : userId})
        if(deletedLikeFromVIdeo.deletedCount == 0){
            throw new ApiError(404,"the like is already deleted")
        }
        return res
         .status(200)
         .json(
            new ApiResponse(200,deletedLikeFromVIdeo,"the like is successfully deleted")
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

const toggleCommentLike = asyncHandler(async(req,res)=>{
     const {commentId} = req.params
     
     if(commentId){
        throw new ApiError(400,"the comment id is required")
     }

     const userId = req.user?._id

     if(!userId){
        throw new ApiError(400,"the user is not authenticate ")
     }
     const comment = await Comment.findById(commentId);

     if(!comment){
        throw new ApiError(400,"No comment is found in this comment ID")
     }

      if(comment.owner.equals(userId)){
        throw new ApiError(403,"the user can't like own comment")
      }

     const alreadyLikedOrNot  = await Like.findOne({comment : commentId, likedBy : userId})

     if(alreadyLikedOrNot){
        const  deletedLikeFromComment = await Like.deleteOne({comment : commentId, likedBy : userId})
        if(!deletedLikeFromComment){
            throw new ApiError(404,"error while deleting the like of the comment ")
        }
        return res
         .status(200)
         .json(
            new ApiResponse(200,deletedLikeFromComment,"the like from the comment deleted successfully")
         )
     }
     const newLike = Like.create({
        comment : commentId,
        likedBy : userId
     })

     if(!newLike){
        throw new ApiError(500,"Error while creating the like")
    }
    
    return res
     .status(200)
     .json(
        new ApiResponse(200,newLike,"the like is successfully created")
     )



     





})



export {
    toggleVideoLike,

}