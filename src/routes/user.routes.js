import { Router } from "express";
import { logOutUser, loginUser, refreshAccessToken, registerUser, changeCurrentPassword, getCurrentUser, changeAccountDetails, changeUserAvatar, changeUserCoverImage, getUserChannelProfile, getUserWatchHistory } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ])
    , registerUser
)

router.route("/login").post(loginUser)


// secured routes

router.route("/logout").post(verifyJWT, logOutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, changeAccountDetails)

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), changeUserAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), changeUserCoverImage)

router.route("/channel/:channelId").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, getUserWatchHistory)

export default router