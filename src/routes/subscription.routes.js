import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { toggleSubscription, getSubscribedChannels , getUserChannelSubscribers } from "../controller/subscription.controller.js";

const router = Router()

router.route("/subscribe/:channelId").get(verifyJwt,toggleSubscription)
router.route("/getUserChannelSubscribers/:channelId").get(verifyJwt,getUserChannelSubscribers)
 router.route("/getSubscribedChannels/:subscriberId").get(verifyJwt,getSubscribedChannels)

export default router