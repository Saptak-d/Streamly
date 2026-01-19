import { Playlist } from "../models/playlist.model.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import mongoose from "mongoose";
import { Video } from "../models/video.models.js";

const createPlaylist  = asyncHandler(async(req ,res)=>{
    const {name , description } = req.body

    if(!name || !description){
        throw new ApiError(400,"the name and description of the playlist is required")
    }
     const userId = req.user?._id
    if(!userId){
        throw new ApiError(400,"the user is required")
    }

    const alreadyExist = await Playlist.find({owner : userId , name : name})
    console.log("exist playlist :---",alreadyExist)
     
    if(alreadyExist.length > 0){
        throw new ApiError(404,"the playlist of this name is already exist")
    }
    const newPlayList = await Playlist.create({
        name,
        description,
        owner : userId
    })

    return res
     .status(200)
     .json(
        new ApiResponse(200,newPlayList,"the new playlist is created successfully")
     )
})

const addVideosToPlaylist = asyncHandler(async(req,res)=>{
    const {videoId ,playlistId} = req.params
    const userId = req.user?._id
    
    if(!userId){
        throw new ApiError(400," Unauthorized the user id is required")
    }

    if(!videoId || !playlistId){
        throw new ApiError(400,'the Video iD and PlayList ID are required')
    }

     const video = await Video.findById(videoId)

     if(!video){
        throw new ApiError(400,"there is no video exist for this ID")
     }

    const playlist = await Playlist.findById(playlistId)

     if(!playlist){
          throw new ApiError(400,"there is no playlist exist for this ID")
     }

     if(!playlist.owner.equals(userId)){
        throw new ApiError(400,"You are not allowed to modify this playlist")
     }

     
        if (playlist.videos.includes(videoId)) {
        throw new ApiError(409, "Video already exists in playlist");
     }

       playlist.videos.push(videoId);
       const result = await playlist.save();

     return res
     .status(200)
     .json(
      new ApiResponse(
      200,
      result,
      "Video added to playlist successfully"
    )
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
            }
        },
           { $project: {
                            _id: 1,
                             name: 1,
                            description: 1,
                             video : {
                                videoFile : 1,
                                thumbnail : 1,
                                title : 1,
                                description: 1,
                                duration :1
                             } 
                      }
                    },
        
    ])
   return res.status(200).json(
    new ApiResponse(
      200,
      playlist,
      "User playlists fetched successfully"
    )
  );
})

const getPlaylistById = asyncHandler(async(req,res)=>{
    const {playlistId} = req.params
   
    if(!playlistId){
        throw new ApiError(400,"the playlist ID is required")
    }

    const playlist = await Playlist.aggregate([
        {$match : {_id : new mongoose.Types.ObjectId(playlistId)}},
        {
            $lookup :{
                from : "videos",
                localField : "videos",
                foreignField : "_id",
                 as : "video"
            },

        },
        {
            $project:{
                _id : 1,
                name : 1,
                description : 1,
                video : {
                      videoFile : 1,
                      thumbnail : 1,
                      title : 1,
                      description: 1,
                      duration :1
                }
            }
        }
    ])
     

    if(playlist.length == 0 ){
        throw new ApiError(404,"there is no playlist found in this Id")
    }

   return res
    .status(200)
    .json(
        new ApiResponse(200,playlist," playlists fetched successfully")
    )
})

const removeVideoFromPlaylist = asyncHandler(async(req,res)=>{
    const {playlistId, videoId} = req.params
     const userID = req.user?._id
     
     if(!userID){
        throw new ApiError(400,"The user ID is required")
    }

    if(!playlistId || !videoId){
        throw new ApiError(400,"playlistId and  videoId")
    }
    const playlist = await Playlist.findById(playlistId)
    const video = await  Video.findById(videoId)

    if(!playlist){
        throw new ApiError(404, "There is no playlsit exist for this ID")
    }
     if(!video){
        throw new ApiError(404, "There is no playlsit exist for this ID")
    }
    if(!playlist.owner.equals(userID)){
        throw new ApiError(400,"the user is not the owner of this playlist")
    }
    const exists = playlist.videos.some(id => id.equals(videoId));

     if (!exists) {
       throw new ApiError(404, "Video not found in playlist");
    }

    const updatedPlaylist = await Playlist.updateOne(
        {_id: playlist},
        {$pull: {videos : videoId}}
    )

    if(updatedPlaylist.acknowledged==false){
        throw new ApiError(500,"internal server Error while ")
    }

    return res
     .status(200)
     .json(
        new ApiResponse(200,updatedPlaylist,"the playlist is successfully changed")
     )
})

const deletePlaylist = asyncHandler(async(req,res)=>{
      const {playlistId} = req.params
      const userID = req.user?._id
        if(!userID){
        throw new ApiError(400,"The user ID is required")
       }
       if(!playlistId){
        throw new ApiError(400,"The playlist Id is required")
       }

       const playlist = await Playlist.findById(playlistId)

        if(!playlist){
            throw new ApiError(400,"thire is no playlist found in this id")
        }
       if(!playlist.owner.equals(userID)){
        throw new ApiError(400,"the playlist is not belongs to the user ")
       }
       const deletedplaylist = await Playlist.findByIdAndDelete(playlistId)

       if(!deletePlaylist){
        throw new ApiError(500,"Internal server Error while deleting the playlist")
       }

       return res
        .status(200)
        .json(
            new ApiResponse(200,deletePlaylist,"the playlist is succesfully deleted")
        )
})


export {
    createPlaylist,
    addVideosToPlaylist,
    getUserPlaylists,
    getPlaylistById,
    removeVideoFromPlaylist,
    deletePlaylist,



}