import { Router } from "express";
import {createTweet, getUserTweets}  from "../controller/tweet.controller.js"
import { verifyJwt } from "../middleware/auth.middleware.js";


const router = Router()

router.route("/createTweet").post(verifyJwt,createTweet)
router.route("/getUserTweets/:userId").get(verifyJwt,getUserTweets)


export default router;