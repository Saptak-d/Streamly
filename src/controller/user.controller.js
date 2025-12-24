import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js"
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokes =  async(userID)=>{
  try {
    const user = await User.findById(userID);
    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefershToken()
        user.refreshToken = refreshToken;
     await user.save({validateBeforeSave : false})
    return {accessToken , refreshToken}
  } catch (error) {
     throw new ApiError(500, 'Something went wrong while generating Access and refresh token')
  }
}

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
     const avatarLocalPath =  req.files?.avatar?.[0]?.path
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

const loginUser  = asyncHandler(async(req,res)=>{
//get the data from req body
// check data is valid or not 
//find the user 
// if the user is not return error 
// if user exist check password  correct or not 
// all rights then generate access and refresh token 
// send them to user  as cookies

 const {username , email , password} = req.body;
  
   if(!username  || !email){
     throw new ApiError(400,"Username or email is required ")
   }
   const user = User.findOne({
     $: [{email} , {username}]
   })

   if(!user){
     throw new ApiError(404, "User does not exist ")
   }

    const passwordCheck = await user.isPasswordCorrect(password);

    if(!passwordCheck){
          throw new ApiError(404, "User does not exist ")
    }
    
    const{accessToken , refreshToken} = await generateAccessAndRefreshTokes(user._id);

    const loggedinUser  = await User.findById(user._id).select("-password -refreshToken")

    const options = {
      httpOnly  : true,
      secure : true
    }
     res

     return res
     .status(200)
     .cookie("accessToken", accessToken, options)
     .cookie("refreshToken",refreshToken,options)
     .json(
       new ApiResponse(200, 
        {
          user : loggedinUser, accessToken,refreshToken
        },
        "User loged in successfully"
       ) 
     )
      new ApiResponse(200,[{accessToken}, {refreshToken}],"user is logged in ")
     






})




const logOutUser = asyncHandler(async(req,res)=>{

})




export {registerUser ,loginUser , logOutUser}