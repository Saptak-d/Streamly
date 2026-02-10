import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js"
import { User } from "../models/user.models.js";
import {uploadOnCloudinary,deleteOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import {sendMail , forgotPasswordMailGenCOntent} from "../utils/mail.js"
import crypto from "crypto"

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
  
    
    const existUser  = await User.findOne({
        $or : [{username}, {email}]
    })

    if(existUser){
         throw new ApiError(409 ,"The User is Already Exist")
    }

     //  File validation
     const avatarLocalPath =  req.files?.avatar?.[0]?.path
     const coverImageLocalPath  = req.files?.coverImage?.[0]?.path

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
        avatar: {
            url : avatar.secure_url,
            public_id : avatar.public_id
        } ,
        coverImage : {
            url : coverImage?.secure_url  || " ",
            public_id : coverImage?.public_id  || " ",
        },
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
          throw new ApiError(404, "User Enter wrong password ")
    }
    
    const{accessToken , refreshToken} = await generateAccessAndRefreshTokes(user._id);

    const loggedinUser  = await User.findById(user._id).select("-password -refreshToken")

    const options = {
      httpOnly  : true,
      secure : true
    }
     
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
        $unset :{
          refreshToken : 1
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
 
 
      const{accessToken , refreshToken} = await generateAccessAndRefreshTokes(user._id)

      if(!accessToken  || !refreshToken){
        console.log(refreshToken)
        throw new ApiError(400,"Something went wrong while generating the tokens ")
      }
 
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

const updateUserAvatar = asyncHandler(async(req,res)=>{
   
   const avatarLocalPath = req.file?.path;

   if(!avatarLocalPath){
      throw new ApiError(400,"The new Avatar is Required ")
   }

      const user   = await User.findById(req.user._id)
        .select("-refreshToken -password")
        
      if(!user){
        throw new ApiError(404,"User is not found")
      }
      const oldPublic_id = user.avatar?.public_id

      const avatar = await uploadOnCloudinary(avatarLocalPath);

      if(!avatar.secure_url || !avatar.public_id){
          throw new ApiError(400,"Error while uploading Avatar ")
      }

      user.avatar = {
          url : avatar.secure_url,
          public_id : avatar.public_id,
      }
     await  user.save({validateBeforeSave : false})

       if(oldPublic_id){
           await deleteOnCloudinary(oldPublic_id)
       }
       
      return res
      .status(200)
      .json(
        new ApiResponse(200,user , "Avater is changed Successfully")
      )
})

const updateUserCoverImage = asyncHandler(async(req,res)=>{
  
  const coverImageLocalPath = req.file?.path
 
  if(!coverImageLocalPath){
     throw new ApiError(401,"The coverImage is required ");
  } 

   const user = await User.findById(req.user?._id)
     .select("-refreshToken -password")

    if(!user){
      throw new ApiError(404,"user not found")
    }
    const oldPublic_id = user.coverImage?.public_id

    const coverImage =  await uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage.secure_url || !coverImage.public_id){
          throw new ApiError(400,"Error while uploading coverImage  ")
      }

     user.coverImage = {
         url : coverImage.secure_url,
          public_id : coverImage.public_id,
     }

     await user.save({validateBeforeSave : false})

     if(oldPublic_id){
           await deleteOnCloudinary(oldPublic_id)
       }
    
    return res
    .status(200)
    .json(
      new ApiResponse(200,user,"The coverImage is Successfully Changed ")
    )
})

const getUserChannelProfile = asyncHandler(async(req,res)=>{

  const {userName} = req.params;

   const channel  = await User.aggregate([
       {
          $match : {
            username : userName?.toLowerCase()
          }

       },

       {
        $lookup : {
          from : "subscriptions",
           localField : "_id",
           foreignField : "channel",
           as : "subscribers"
        }
       },

       {
         $lookup : {
          from : "subscriptions",
          localField : "_id",
          foreignField : "subscriber",
          as : "subscribeTo"
         }
       },

       {
        $addFields: {
          subscribersCount  : {
              $size : "$subscribers", 
          },
          channelsubscribedToCount : {
            $size : "$subscribeTo"
          },
          isSubscribed : {
            $cond:{
               if : {$in: [req.user?._id , "$subscribers.subscriber"]},
               then :true,
               else :false
            }
          },
          
        }
       },
       {
        $project : {
            fullName : 1,
            username : 1 ,
            subscribersCount : 1 ,
            channelsubscribedToCount :1,
            isSubscribed:1,
            avatar : 1,
            coverImage :1 ,
            email :1,
        }
       }

   ])
     console.log(channel[0])

   if(!channel?.length){
    throw new ApiError(500, "Internal Server Error Channel does not exist")
   }

    return res
    .status(200)
    .json(
      new ApiResponse(200,channel[0],"Your UserChannelProfile is sended")
    )

})

const getWatchHistory = asyncHandler(async(req,res)=>{

   const user  = await User.aggregate([

    {
      $match:{
       _id : new mongoose.Types.ObjectId(req.user._id)
      }
    },
    {
      $lookup:{
          from : "videos",
          localField : "watchHistory",
          foreignField: "_id",
          as :"watchHistory",
          pipeline : [
            {
              $lookup : {
                from : "users",
                localField : "owner",
                foreignField : "_id",
                as : "owner",
                pipeline : [
                  {
                    $project : {
                      fullName : 1 ,
                      username : 1,
                      avatar : 1
                    }
                  }
                ]
              }
            },
            {
              $addFields : {
                 owner : {
                  $first : "$owner"
                 }
              }
            }
          ]
      }
    }
   ])

   return res.status(200)
   .json(
    new ApiResponse(
      200,
      user[0].watchHistory,
        "watch history fetched Successfully"
    )
   )

})

const forgetsPassword = asyncHandler(async(req,res)=>{
   const {email} = req.body;
   const user = await User.findOne({email})
    .select("-password -refreshToken");
   if(!user){
     return res
     .status(200)
     .json(
      new ApiResponse(200,"The ReSet password link is shared to your Email 1")
     )
   }

   const {hashedToken , unhashedToken , tokenExpiry} =  user.generateTemporatryToken();

   if(!hashedToken || !unhashedToken || !tokenExpiry){
      throw new ApiError(500,"error while getting tokens")
   }

   user.forgotpasswordToken = hashedToken;
   user.forgotpasswordExpiry = tokenExpiry ;

   await user.save({validateBeforeSave : false});

  const sendedMail = await sendMail({
    email : user?.email,
    subject : "Reset your Streamly Account Password",
    mailGenContent : forgotPasswordMailGenCOntent(user.username,``)
   })
    return res
     .status(200)
     .json(
      new ApiResponse(200,sendedMail,"The Reset password link is shared to your Email 2")
     )
})

const resetPassword = asyncHandler(async(req,res)=>{

   const {unhashedToken} = req.params;
    if(!unhashedToken){
      throw new ApiError(402,"Invalid Request")
    }
    const {newPassword} = req.body;
   
    const hashedToken = crypto.createHash("sha256").update(unhashedToken).digest("hex")

    const user = await User.findOne({forgotpasswordToken : hashedToken , forgotpasswordExpiry : {$gt: Date.now()}}).select("-password -refreshToken")
    
    if(!user){
      throw new ApiError(403,"invlid request check your URL")
    }

    user.password    = newPassword ;
    user.refreshToken = undefined;
    user.forgotpasswordToken = undefined;
    user.forgotpasswordExpiry = undefined;
     
    const updatedUser = await user.save();

    return res
     .status(200)
     .json(
      new ApiResponse(200,"The password is changed successfully ")
     )

})

export {
registerUser,
loginUser,
logOutUser,
refreshAccessToken,
changeCurrentPassword,
getCurrentUser,
updateAccountDetails,
updateUserAvatar,
updateUserCoverImage,
getUserChannelProfile,
getWatchHistory,
forgetsPassword,
resetPassword

}