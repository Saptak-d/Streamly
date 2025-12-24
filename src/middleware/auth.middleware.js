import { ApiError } from "../utils/ApiErrors";
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.models";


export const verifyJwt = asyncHandler(async(req,res,next)=>{

    try {
        const {token} = req.cokkie?.accessToken || req.header("authorization")
        if(!token){
            new ApiError(401, "The user need to login First")
        }
        const decorded = await jwt.verify(accessToken , process.env.ACCCESS_TOKEN_SECRECT)?.replace("Beer", "")
    
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