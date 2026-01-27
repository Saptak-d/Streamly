import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app  = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended : true , limit : "16kb"}));
app.use(express.static("public"))
app.use(cookieParser())


//routes
import userRoutes from "./routes/user.routes.js"
app.use("/api/v1/users",userRoutes)

import videoRoutes from "./routes/video.routes.js"
app.use("/api/v1/video",videoRoutes)

import tweetRoutes from "./routes/tweet.routes.js"
app.use("/api/v1/tweet",tweetRoutes)

import subscriptionRoutes from "./routes/subscription.routes.js"
app.use("/api/v1/subscription",subscriptionRoutes)

import playlistRoutes from "./routes/playlist.routes.js"
app.use("/api/v1/playlist",playlistRoutes)

import likeRoutes from "./routes/like.routes.js"
app.use("/api/v1/like",likeRoutes)

import commentRoutes from "./routes/comment.routes.js"
app.use("/api/v1/Comment",commentRoutes)

import  dashboardRoutes from "./routes/dashboard.routes.js"
app.use("/api/v1/dashboard",dashboardRoutes)


app.use((err, req, res, next) => { 
    res.
    status(err.statusCode || 500)
    .json({ success: false, message: err.message }) })



export {app} 