import { Router } from "express";
import {getChannelStats,getChannelVideos} from "../controller/dashboard.controller.js"
import { verifyJwt } from "../middleware/auth.middleware.js";


const router = Router()

router.route("/getChannelStats").get(verifyJwt,getChannelStats);
router.route("/getChannelVideos").get(verifyJwt,getChannelVideos)


export default router