import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js"



const healthcheck = asyncHandler((req,res)=>{
    res.send("The server is working ")
})

const healthcheckInputCheck = asyncHandler((req,res)=>{
     const{username , password} = req.body;
    
     res.status(200).json(
        new ApiResponse(200,{username,password},"the data is successfully fetched")
     )

})

export {
    healthcheck,
    healthcheckInputCheck
}
