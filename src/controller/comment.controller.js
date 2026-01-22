import mongoose from "mongoose";
import { Comment } from "../models/comment.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getVideoComments = asyncHandler(async(req , res)=>{

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

export {
    addComment,
}