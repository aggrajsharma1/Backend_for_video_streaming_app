import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isVideoLiked, likeFunction} from "../controllers/like.controller.js";

const router = Router()

router.route("/:videoId/isVideoLiked").get(verifyJWT, isVideoLiked)
router.route("/:videoId/like").get(verifyJWT, likeFunction)

export default router