import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { exploreVideos, videoUpload, videoWatch } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/upload").post(
    verifyJWT,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    videoUpload
)

router.route("/watch/:videoId").get(verifyJWT, videoWatch)

router.route("/explore").get(verifyJWT, exploreVideos)



export default router