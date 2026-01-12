import { Tweet } from "../models/twite.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiErrors.js";


const createTweet = asyncHandler(async(req , res)=>{
    const {content} = req.body
    if(!content){
        throw new ApiError(404,"content is required")
    }
    const user = req.user._id;
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
}
)
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


export {
    createTweet,
    getUserTweets

}