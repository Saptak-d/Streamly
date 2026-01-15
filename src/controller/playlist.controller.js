import { Playlist } from "../models/playlist.model.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"

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