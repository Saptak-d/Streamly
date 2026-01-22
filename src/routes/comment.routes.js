import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import {addComment,updateComment,getVideoComments} from "../controller/comment.controller.js"

const router = Router()

router.route("/addComment/:videoId").post(verifyJwt,addComment);
router.route("/updateComment/:commentId").patch(verifyJwt,updateComment);
router.route("/getVideoComments/:videoId").get(getVideoComments)

export default router;