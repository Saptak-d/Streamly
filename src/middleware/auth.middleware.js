import { ApiError } from "../utils/ApiErrors.js";
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";


export const verifyJwt = asyncHandler( async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken ||  req.header("Authorization")?.replace("Bearer ", "")
      
        
        if(!token){
            new ApiError(401, "The user need to login First")
        }

        const decorded =  jwt.verify(token , process.env.ACCCESS_TOKEN_SECRECT)

        
        const user  = await User.findById(decorded._id).select("-password -refreshtoken")
    
        if(!user){
            new ApiError(401,"invalid access token")
        }
        req.user = user;
        next()
    } catch (error) {
        new ApiError(401,error?.message || "invalid Access Token")
    }
} )

