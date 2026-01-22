import mongoose from "mongoose";
import { Comment } from "../models/comment.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getVideoComments = asyncHandler(async(req , res)=>{
      const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    const skip = (page - 1) * limit ;
    
})

const addComment = asyncHandler(async(req,res)=>{
    const userId = req.user?._id;
    if(!userId){
        throw new ApiError(400,"the user need be authenticate")
    }

    const {videoId} =  req.params

     if(!videoId){
        throw new ApiError(400,"the video id is required")
    }

     const {content} = req.body

     if(!content){
        throw new ApiError(400,"the Content is required")
     }
        const comment = await Comment.create({
              content ,
              video : videoId,
              owner : userId
        })

        if(!comment){
            throw new ApiError(500,"error while creating the content")
        }

        return res
         .status(200)
         .json(
            new ApiResponse(200,"The Comment is Successfully created")
         )
})

const updateComment  = asyncHandler(async(req,res)=>{
    const {commentId} = req.params
    const {content} = req.body
    const userId = req.user._id

    if(!content){
        throw new ApiError(400,"the content is required")
    }

    if(!commentId){
        throw new ApiError(400,"the comment id is required")
    }

     if(!userId){
        throw new ApiError(400,"the User is need to authenticated")
     }

     const result  = await Comment.updateOne(
        {
            _id : commentId ,
             owner : userId,
             content : {$ne : content}

        },
        {
            $set: {content}
        }
     )

     if(result.matchedCount === 0){
        throw new ApiError( 403,"Comment not found or you are not the owner")
     }

     if(result.modifiedCount === 0){
        throw new ApiError( 400,"Same content provided, nothing to update")
     }

     return res
      .status(200)
      .json(
        new ApiResponse(200,null,"the comment updated succesfully")
      )

})


export {
    addComment,
}