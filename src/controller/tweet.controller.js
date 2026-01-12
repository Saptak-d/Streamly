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
        user
      })
      return res
      .status(200)
      .json(
        new ApiResponse(200,tweet,"the tweet is created successfully")
      )
}
)
