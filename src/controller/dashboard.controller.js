import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js";


const getChannelStats = asyncHandler(async(req,res)=>{

     const  channelId = req.user?._id

     if(!channelId){
        throw new ApiError(400,"the channel id is required")
     }  

     const allData  = await User.aggregate([
         {$match:{_id : channelId}},
         {$lookup:{
            from : "videos",
            localField:"_id",
            foreignField : "owner",
             as : "videos"
         }},
         {$lookup : {
            from : "subscriptions",
            localField:"_id",
            foreignField : "channel",
             as : "subscribers"
         }},
         {
            $lookup :{
                from : "likes",
                let :{videoIds : "$videos._id"},
                pipeline : [
                    {
                            $match : {
                                $expr : {
                                    $in : ["$video", "$$videoIds"]
                                }
                            }
                        }
                ],
                as : "likes"
            }
         },
         {$addFields:{
                totalVideos : {$size : "$videos"} ,
                totalViews  : {$sum : "$videos.views"} ,
                totalSubscribers : {$size: "$subscribers"},
                totalLikes : {$size : "$likes"}
         }},
         {
            $project :{
                  videos: 0,
                 subscribers: 0,
                 likes: 0,
                 password : 0,
                 createdAt : 0,
                 updatedAt : 0 ,
                 refreshToken : 0


            }
         },
         
     ])

     if(allData.length === 0){
        throw new ApiError(403,"No data found")
     }

     return res
      .status(200)
       .json(
        new ApiResponse(200,allData[0],"data successfully fetched")
       )
})

const getChannelVideos  = asyncHandler(async(req,res)=>{
    const{channelId} = req.user?._id
    if(!channelId){
        throw new ApiError(400,"the video id is required")
    }

    const allvideos = await User.aggregate([
         {$match : {_id :channelId}},
         {
            $lookup :{
                from : "videos",
                localField : "_id",
                foreignField : "owner",
                 as :   "videos"
            }
         },
         {
            $project:{
                username : 1,
                email : 1,
                fullName : 1 ,
                avatar : 1,
              coverImage : 1,
              videos : {
                videoFile : 1 ,
                thumbnail  : 1,
                title : 1,
              }
            }   
         }

    ])

    return res
     .status(200)
     .json(new ApiResponse(200,allvideos[0],"ALl videos successfully fetched"))

})

export {
    getChannelStats,
    getChannelVideos,

}