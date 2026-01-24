import { Router } from "express";
import {getChannelStats} from "../controller/dashboard.controller.js"
import { verifyJwt } from "../middleware/auth.middleware.js";


const router = Router()

router.route("/getChannelStats").get(verifyJwt,getChannelStats);


export default router