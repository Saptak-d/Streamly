import { Playlist } from "../models/playlist.model.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import mongoose from "mongoose";

const createPlaylist  = asyncHandler(async(req ,res)=>{
    const {name , description } = req.body

    if(!name || !description){
        throw new ApiError(400,"the name and description of the playlist is required")
    }
     const userId = req.user?._id
    if(!userId){
        throw new ApiError(400,"the user is required")
    }

    const alreadyExist = await Playlist.find({owner : userId , name})
     
    if(alreadyExist){
        throw new ApiError(404,"the playlist of this name is already exist")
    }
    const newPlayList = await Playlist.create({
        name,
        description,
        owner : userId
    })

    return res
     .starus(200)
     .json(
        new ApiResponse(200,newPlayList,"the new playlist is created successfully")
     )
})

const getUserPlaylists = asyncHandler(async(req,res)=>{
    const{userId} = req.params
    if(!userId){
        throw new ApiError(400,"the user iD is required")
    }
    const playlist =  await Playlist.aggregate([
        {$match: {owner : new mongoose.Types.ObjectId(userId)}},
        {
            $lookup :{
                from : "videos",
                localField : "videos",
                foreignField : "_id",
                 as : "video",
                 pipeline : [
                    {
                        $lookup :{
                            from : "users",
                            localField : "owner",
                            foreignField : "_id",
                             as : "owner"
                        },
                    },
                     {$unwind : "$owner"},
                    {
                      $project: {
                            _id: 1,
                             title: 1,
                            description: 1,
                            videoFile: 1,
                            thumbnail: 1,
                            owner: {
                             _id: "$owner._id",
                             username: "$owner.username",
                             fullName: "$owner.fullName",
                             avatar: "$owner.avatar",
                          },
                      }
                    }
                 ]
            }
        },
        {
            $project :{
                   _id: 1,
                   name: 1,
                   description: 1,
                   videos: 1,
                   createdAt: 1,
            }
        }
    ])
   return res.status(200).json(
    new ApiResponse(
      200,
      playlists,
      "User playlists fetched successfully"
    )
  );
})