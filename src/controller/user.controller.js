import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js"
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async(req,res)=>{

// get user details from frontend
// validation — not empty
// check if user already exists: username, email
// check for images, check for avatar
// upload them to cloudinary, avatar
// create user object— create entry in db
// remove password and refresh token field from response
// check for user creation
// return res




  const {username , email, fullName , password} =  req.body;
  
    if( 
        [username , email , fullName , password].some((field) => field?.trim() === "")  
    ){
         throw new ApiError(400 , "All Fields are  Rrequired ")
    }

    const existUser  = await User.findOne({
        $or : [{username}, {email}]
    })

    if(existUser){
         throw new ApiError(409 ,"The User is Already Exist")
    }
     const avatarLocalPath =  req.files?.avatar[0]?.path
     const coverImageLocalPath  = req.files?.coverImage?.[0]?.path
     console.log("the avtarlink-",avatarLocalPath)

     if(!avatarLocalPath ){
        throw new ApiError(400, "Avatar file is Required")
     }
       const avatar =  await uploadOnCloudinary(avatarLocalPath)
       let coverImage ;

       if(coverImageLocalPath){
             coverImage = await uploadOnCloudinary(coverImageLocalPath)
       }
       
       if(!avatar){
         throw new ApiError(400,"Avatar is required ")
       }

       const user =  await User.create({
        fullName,
        avatar: avatar.url,
        coverImage : coverImage?.url || " ",
        email,
        password,
        username : username.toLowerCase()
       });

       const createdUser  = await User.findById(user._id).select("-password -refreshToken")

       if(!createdUser){
            throw new ApiError(500,"Something Went Wrong while Registering  The User")
       }

       return res.status(201).json(
        new ApiResponse(201,createdUser , "User is Created Successfully")
       )

    





   
})





export {registerUser}