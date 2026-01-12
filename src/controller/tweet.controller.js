import { Tweet } from "../models/tweet.models.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiErrors.js";


const createTweet = asyncHandler(async(req , res)=>{

    const {content} = req.body
    if(!content){
        throw new ApiError(404,"content is required")
    }
    const user = req.user?._id;
     if(!user){
        throw new ApiError(404,"the user is need to login  ")
     }
      const tweet  = await Tweet.create({
        content,
        owner : user
      })

      if(!tweet){
         throw new ApiError(500,"Error while uploading the tweet")
      }
      return res
      .status(200)
      .json(
        new ApiResponse(200,tweet,"the tweet is created successfully")
      )
})
const getUserTweets = asyncHandler(async(req,res)=>{

     const {userId}  = req.params

      if(!userId){
        throw new ApiError(404, "The user id is required")
      }

      const tweets = await Tweet.find({owner:userId})

      if(!tweets){
         throw  new ApiError(404,"cant find any tweet")
      }

      return res
      .status(200)
      .json(
        new ApiResponse(200,tweets,"all Tweets successfully returned")
      )

}) 
const updateTweet  = asyncHandler(async(req,res)=>{
   
      const {content} = req.body

       if(!content){
         throw new ApiError(404,"the content is required")
       }

      const {tweetId}  = req.params
      if(!tweetId){
         throw new ApiError(404,"tweetId is required")
      }
       
      const tweet = await Tweet.findById(tweetId)

       if(!tweet){
        throw new ApiError(404,"there is no Tweet exist in this Id ")
       }
      
      const userId = req.user._id

      if(!userId){
        throw new ApiError(404,"user invalid")
      }

      if(tweet.owner.toString() !== userId.toString()){
        throw new ApiError(404,"user invalid to Edit")
      }

       tweet.content = content;

 
        await tweet.save();

      return res
      .status(200)
      .json(
        new ApiResponse(200,tweet,"the tweet is successfully changed")
      )
})
const deleteTweet = asyncHandler(async(req,res)=>{
    const {tweetId} = req.params;
    const userId = req.user._id;
    if(!tweetId || !userId){
        throw new ApiError(404,"the tweet ID and userId is required")
    }

    const tweet = await Tweet.findById(tweetId)

    if(!tweet){
        throw new ApiError(404,"no Tweet is found for this tweet ID")
    }

    if(tweet.owner.toString() !== userId.toString()){
        throw new ApiError(400,"The tweet is not belongs to the user ")
    }

     const deletedTweet = await tweet.deleteOne()

     if(!deletedTweet){
        throw new ApiError(500,"internal server error while Deleting the Tweet ")
     }

     return res
     .status(200)
     .json(
        new ApiResponse(200,deletedTweet,"the Tweet is Deleted")
     )
})



export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}