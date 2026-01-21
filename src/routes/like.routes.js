import { Router } from "express";
import {verifyJwt} from "../middleware/auth.middleware.js"
import { toggleVideoLike,toggleCommentLike,toggleTweetLike,getLikedVideos } from "../controller/like.controller.js";

const router  = Router()

router.route("/toggleVideoLike/:videoId").get(verifyJwt,toggleVideoLike)
router.route("/toggleCommentLike/:commentId").get(verifyJwt,toggleCommentLike)
router.route("/toggleTweetLike/:tweetId").get(verifyJwt,toggleTweetLike)
router.route("/getLikedVideos").get(verifyJwt,getLikedVideos)


export default router;