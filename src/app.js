import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: true,
    // origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({
    limit: "16kb"
}))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(express.static("public"))

app.use(cookieParser())


// routes import

import userRouter from './routes/user.routes.js'
import subscribeRouter from './routes/subscriber.routes.js'
import likeRouter from './routes/like.routes.js'
import videoRouter from './routes/video.routes.js'


// routes declaration

app.use("/api/v1/users", userRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/subscriptions", subscribeRouter)
app.use("/api/v1/video", likeRouter)


export { app } 