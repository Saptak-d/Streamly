import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js"
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

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
   console.log(email);
  
   if(!username  &&  !email){
     throw new ApiError(400,"Username or email is required ")
   }
   const user = await User.findOne({
     $or:[{email} , {username}]
   })

   if(!user){
     throw new ApiError(404, "User does not exist ")
   }

    const passwordCheck = await user.isPasswordCorrect(password)

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
  
   await User.findByIdAndUpdate(
      req.user._id,
      {
        $set :{
          refreshToken : undefined
        },
        
      },
      {
        // this one is used for to get the nw updated responce 
        new : true
      }
    )
    const options = {
      httpOnly :true,
      secure : true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
      new ApiResponse(200,{}, "User logged Out ")
    )
 
     

})

const refreshAccessToken = asyncHandler(async(req,res)=>{

   const incommingRefreshToken  =  req.cookies?.refreshToken || req.body.refreshToken
   if(!incommingRefreshToken){
     throw new ApiError(400,"You need to login ")
   }

   try {
    const decordeToken = jwt.verify(incommingRefreshToken ,process.env.REFRESH_TOKEN_SECRECT);
 
   
 
     const user = await User.findById(decordeToken._id).select("-password");
     
      if(!user){
       throw new ApiError(401,"Unauthorized request");
      }
 
      if(user?.refreshToken !== incommingRefreshToken){
         throw new ApiError(401,"Unauthorized request");
      }
 
      const{accessToken , refreshToken} = generateAccessAndRefreshTokes(user._id)
 
      const options = {
       httpOnly : true ,
        secure : true
      }
 
      return res.status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken",refreshToken,options)
      .json(
       new ApiResponse(200,
          {
           user : user, accessToken,refreshToken
         },
         "Access token is Refreshed"
       )
      )
   } catch (error) {
     throw new ApiError(401,error?.message || "Invalid refresh Token")
   }

})

const changeCurrentPassword = asyncHandler(async(req,res)=>{
   const {oldPassword,newPassword} = req.body;
   const id = req.user?._id;

   if(!id){
      throw new ApiError(401,"Invalid Access")
   }

     if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old password and new password are required");
  }

   const  existUser  = await User.findById(id);

     if(!existUser){
      throw new ApiError(401,"User not found")
     }


    const ispasswordCOrrect = await existUser.isPasswordCorrect(oldPassword)
    if(!ispasswordCOrrect){
        throw new ApiError(403,"Invalid old password ")
    } 
    

     const isSamePassword = await existUser.isPasswordCorrect(newPassword);

  if (isSamePassword) {
    throw new ApiError(
      400,
      "New password must be different from previous password"
    );
  }
    
   existUser.password = newPassword;
    existUser.refreshToken = null; 

      await existUser.save({validateBeforeSave : false});

   return res.status(200)
   .json(
    new ApiResponse(200,{},"Passsword Change Successfully")
   )
})

const getCurrentUser = asyncHandler(async(req,res)=>{
  
   const user  = req?.user;
    if(!user){
        throw new ApiError(401, "Unauthorized")
    }
    
   return res.status(200)
   .json(
      new ApiResponse(200,user," Current User is fetched SuccessFully")
   )

  })

const updateAccountDetails = asyncHandler(async(req,res)=>{

  const  {fullName ,email} = req.body;

   if(!fullName || ! email){
      throw new ApiError(400, "All fields are required ")
   }

    const user  = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set :{
          fullName,
          email
        }
      },
      {
        new : true
      }
    ).select("-password")

    return res
    .status(200)
    .json(
      new ApiResponse(200,user,"User Details is changed successfully ")
    )



})






export {
registerUser,
loginUser,
logOutUser ,
refreshAccessToken,
changeCurrentPassword,
getCurrentUser 
}