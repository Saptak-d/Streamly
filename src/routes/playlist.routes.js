import { Router } from "express";
import {verifyJwt} from "../middleware/auth.middleware.js"
import {createPlaylist,addVideosToPlaylist,getUserPlaylists} from "../controller/playlist.controller.js"

const router  = Router()

router.route("/createPlaylist").post(verifyJwt,createPlaylist);
router.route("/addVideosToPlaylist").post(verifyJwt,addVideosToPlaylist)
router.route("/getUserPlaylists/:userId").get(verifyJwt,getUserPlaylists)

export default router
