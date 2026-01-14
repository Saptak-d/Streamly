import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { subscription } from "../models/subscription.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { LIMIT } from "styled-components/dist/utils/createWarnTooManyClasses.js";
import { count } from "console";

const toggleSubscription  = asyncHandler(async (req,res)=>{
    const {channelId} = req.params
    const userId = req.user?._id

    if(!userId || !channelId){
        throw new ApiError(400,"the userID and ChannelID is required")
    }
    // Prevent self-subscription
   if (userId.toString() === channelId.toString()) {
     throw new ApiError(400, "You cannot subscribe to yourself");
   }

     const alreadySuscribed = await subscription.findOne({subscriber : userId , channel:channelId })

     if(alreadySuscribed){
         const  unsuscribed = await alreadySuscribed.deleteOne()
         
        if (unsuscribed.deletedCount === 0){
            throw new ApiError(404,"the channel is unsuscribed")
         }
         return res
         .status(200)
         .json(
            new ApiResponse(200,unsuscribed , "The channel is successfully unsuscribed")
         )
     }
       const newSuscribe = await subscription.create({
          subscriber :userId,
          channel :channelId
       })

       if(!newSuscribe){
         throw new ApiError(500,"internal server Error while subcribing the channel")
       }

       return res
       .status(200)
       .json(
        new ApiResponse(200,newSuscribe,"the channel is suscribed successfully")
       )

})


// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
     const page = Number(req.query.page) || 1
     const limit  = Number(req.query.limit) || 20 
     const skip = (page - 1) * limit

   if(!channelId){
    throw new ApiError(400,"the channel id is required")
   }

    const subscribers = await subscription.aggregate([
        {$match : {channel : new mongoose.Types.ObjectId(channelId)}},//match the  documents which has this channel id and return an array 
        { $sort : {createdAt : -1}},//sort the array for better paggination 
        {
            $facet: {//facet is nothing but a way to perform 2 operation on a single input by $facet copies the same input stream into two parallel pipelines:
                data: [//data is the field name 
                    {$skip :skip}, 
                    {$limit : limit},
                    {
                        $lookup :{
                            from : "users",
                            localField : "subscriber",
                            foreignField : "_id",
                             as : "subscriber"
                        },
                    },
                    
                    { $unwind : "$subscriber"},//it used to change the lookup array into object 

                    {
                        $project : {
                             _id : 0 ,
                            "subscriber._id": 1,
                            "subscriber.username" : 1,
                            "subscriber.avatar" : 1,

                        }
                    }
                ],
                totalSubscribers : [{$count : "count"}]
            }
        }

    ])
       const result = subscribers[0] || {};
       const totslCount  = result.totalSubscribers?.[0]?.count || 0
     
    return res
     .status(200)
     .json(
        new ApiResponse(
            200,
            {
                count : totslCount,
                subscribers : result.data || [],
                page,
                limit,
            },
            "Subscribers fetched successfully")
     )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}