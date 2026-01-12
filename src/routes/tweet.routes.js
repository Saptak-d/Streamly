import { Router } from "express";
import {createTweet, deleteTweet, getUserTweets, updateTweet}  from "../controller/tweet.controller.js"
import { verifyJwt } from "../middleware/auth.middleware.js";


const router = Router()

router.route("/createTweet").post(verifyJwt,createTweet)
router.route("/getUserTweets/:userId").get(verifyJwt,getUserTweets)
router.route("/updateTweet/:tweetId").patch(verifyJwt,updateTweet)
router.route("/deleteTweet/:tweetId").delete(verifyJwt,deleteTweet)


export default router;