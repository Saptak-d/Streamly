import { Router } from "express";
import {verifyJwt} from "../middleware/auth.middleware.js"
import {createPlaylist,addVideosToPlaylist,getUserPlaylists,getPlaylistById,removeVideoFromPlaylist,deletePlaylist,updatePlaylist} from "../controller/playlist.controller.js"

const router  = Router()

router.route("/createPlaylist").post(verifyJwt,createPlaylist);
router.route("/addVideosToPlaylist/:playlistId/:videoId").post(verifyJwt,addVideosToPlaylist)
router.route("/getUserPlaylists/:userId").get(verifyJwt,getUserPlaylists)
router.route("/getPlaylistById/:playlistId").get(verifyJwt,getPlaylistById)
router.route("/removeVideoFromPlaylist/:playlistId/:videoId").patch(verifyJwt,removeVideoFromPlaylist)
router.route("/deletePlaylist/:playlistId").delete(verifyJwt,deletePlaylist)
router.route("/updatePlaylist/:playlistId").patch(verifyJwt,updatePlaylist)

export default router
