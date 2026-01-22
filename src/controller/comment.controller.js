import mongoose from "mongoose";
import { Comment } from "../models/comment.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getVideoComments = asyncHandler(async(req , res)=>{
      const {videoId} = req.params
      if(!videoId){
        throw new ApiError(400,"the video is required")
      }
    const {page = 1, limit = 2} = req.query
    const skip = (page - 1) * limit ;

     const comments = await Comment.find({video : videoId})
     .skip(skip)
     .limit(2)

     return res
      .status(200)
      .json(
        new ApiResponse(200,comments,"successfully fetched all comments of the  Video")
      )
    
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
            new ApiResponse(200,comment,"The Comment is Successfully created")
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
    
   const comment = await Comment.findById(commentId);

   if(!comment){
    throw new ApiError(404,"NO comment is found")
   }

     if(!comment.owner.equals(userId)){
        throw new ApiError(403,"you are not allowed to updated this comment")
     }

     if(comment.content.trim() === content.trim()){
        throw new ApiError(400,"Same content provided, nothing to update")
     }

      comment.content = content ;
      await comment.save()

     return res
      .status(200)
      .json(
        new ApiResponse(200,comment,"the comment updated successfully")
      )

})

const deleteComment = asyncHandler(async(req,res)=>{
    const {commentId} = req.params 
    
     if(!commentId){
        throw new ApiError(400,"The comment ID is required")
     }
     const userId = req.user._id

      if(!userId){
        throw new ApiError(400,"the User ID is required")
      }

     const comment = await Comment.findById(commentId)

     if(!comment){
        throw new ApiError(404,"No comment is found for this id")
     }

     if(!comment.owner.equals(userId)){
        throw new ApiError(403,"the user is not the owner ")
     }

     const deleteComment  = await Comment.deleteOne({_id:commentId})

     if(deleteComment.acknowledged == false){
        throw new ApiError(404,"error while deletiong the comment")
     }

     return res
      .status(200)
      .json(
        new ApiResponse(200,deleteComment,"the comment is successfully deleted")
      )
})

export {
    addComment,
    updateComment,
    getVideoComments,
    deleteComment
}