import { Router } from "express";
import {getVideoById, publishAVideo} from "../controller/videos.controller.js"

import { upload } from "../middleware/multer.middleware.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router  = Router()

router.route("/uploadVideo").post(verifyJwt,
    upload.fields([
    {
        name : "videoFile",
        maxCount : 1
    },
    {
        name : "thumbnail" ,
        maxCount : 1
    }

]),publishAVideo)

router.route("/getVideoById/:videoId").get(verifyJwt,getVideoById)



 export  default router