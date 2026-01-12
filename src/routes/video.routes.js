import { Router } from "express";
import {getVideoById, publishAVideo, updateVideo, deleteVideo , togglePublishStatus, getAllVideos} from "../controller/videos.controller.js"

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
router.route("/updateVideo/:videoId").patch(verifyJwt,upload.single("thumbnail"),updateVideo)
router.route("/deleteVideo/:videoId").delete(verifyJwt,deleteVideo)
router.route("/updatePublishStatus/:videoId").patch(verifyJwt,togglePublishStatus)
router.route("/getAllVideos").get(getAllVideos)



 export  default router