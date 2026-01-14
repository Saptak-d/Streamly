import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { toggleSubscription, getSubscribedChannels , getUserChannelSubscribers } from "../controller/subscription.controller.js";

const router = Router()

router.route("/subscribe").get(verifyJwt,toggleSubscription)
router.route("/getSubscribedChannels").get(verifyJwt,getSubscribedChannels)
router.route("/getUserChannelSubscribers").get(verifyJwt,getUserChannelSubscribers)

export default router