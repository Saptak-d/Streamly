import { Router } from "express";
import {verifyJwt} from "../middleware/auth.middleware.js"
import {createPlaylist,addVideosToPlaylist,getUserPlaylists,getPlaylistById} from "../controller/playlist.controller.js"

const router  = Router()

router.route("/createPlaylist").post(verifyJwt,createPlaylist);
router.route("/addVideosToPlaylist/:playlistId/:videoId").post(verifyJwt,addVideosToPlaylist)
router.route("/getUserPlaylists/:userId").get(verifyJwt,getUserPlaylists)
router.route("/getPlaylistById/:playlistId").post(verifyJwt,getPlaylistById )

export default router
