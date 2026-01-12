import { Router } from "express";
import {createTweet}  from "../controller/tweet.controller.js"
import { verifyJwt } from "../middleware/auth.middleware.js";


const router = Router()

router.route("/createTweet").post(verifyJwt,createTweet)


export default router;