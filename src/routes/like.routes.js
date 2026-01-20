import { Router } from "express";
import {verifyJwt} from "../middleware/auth.middleware.js"
import { toggleVideoLike,toggleCommentLike } from "../controller/like.controller.js";

const router  = Router()

router.route("/toggleVideoLike/:videoId").get(verifyJwt,toggleVideoLike)
router.route("/toggleCommentLike/:commentId").get(verifyJwt,toggleCommentLike)


export default router;