import { Router } from "express";
import { isChannelSubscribed, subscribeFunction} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/channel/:channelId/isSubscribed").get(verifyJWT, isChannelSubscribed)
router.route("/channel/:channelId/subscribe").get(verifyJWT, subscribeFunction)

export default router