import { Router } from "express";
import {getVideoById, publishAVideo, updateVideo, deleteVideo , togglePublishStatus, getAllVideos} from "../controller/videos.controller.js"

import { upload } from "../middleware/multer.middleware.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import {publishAVideovideoValidator , getVideoByIdValidator , updateVideoValidator} from "../validators/video.validator.js"
import {validate} from "../middleware/validator.middleware.js"

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

]),publishAVideovideoValidator(), validate,  publishAVideo)

router.route("/getVideoById/:videoId").get(verifyJwt,getVideoByIdValidator(), validate, getVideoById)
router.route("/updateVideo/:videoId").patch(verifyJwt,upload.single("thumbnail"),updateVideoValidator(),validate,updateVideo)
router.route("/deleteVideo/:videoId").delete(verifyJwt,deleteVideo)
router.route("/updatePublishStatus/:videoId").patch(verifyJwt,togglePublishStatus)
router.route("/getAllVideos").get(getAllVideos)



 export  default router