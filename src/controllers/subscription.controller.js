import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import mongoose from "mongoose";

// const subscribeFunction = asyncHandler(async (req, res) => {

//     const { channelId } = req.params

//     const userId = req.user._id.toString()
//     // const user = req.user?._id

//     // console.log("user ", user);
//     // console.log("channelId", channelId);
//     // console.log(userId === channelId);

//     if (!userId) {
//         throw new ApiError(400, "User does not exist")
//     }

//     if (!channelId) {
//         throw new ApiError(400, "channel not defined")
//     }

//     const isSubscribed = await Subscription.aggregate([
//         {
//             $match: {
//                 subscriber: new mongoose.Types.ObjectId(userId),
//                 channel: new mongoose.Types.ObjectId(channelId)
//             }
//         }
//     ])

//     console.log("isSubscribed: ", isSubscribed)

//     if (isSubscribed.length || userId === channelId) {
//         return res
//             .status(200)
//             .json(
//                 new ApiResponse(
//                     200,
//                     isSubscribed[0],
//                     "already subscribed"
//                 )
//             )
//     }

//     const subscriptionDetails = await Subscription.create({
//         subscriber: userId,
//         channel: channelId
//     })



//     return res
//         .status(200)
//         .json(
//             new ApiResponse(
//                 200,
//                 subscriptionDetails,
//                 `subscribed ${channelId}`
//             )
//         )
// })

const isChannelSubscribed = asyncHandler(async (req, res) => {

    const { channelId } = req.params

    const userId = req?.user._id.toString()

    if (!channelId) {
        throw new ApiError(400, "channel not defined")
    }

    if (!userId) {
        throw new ApiError(400, "invalid request")
    }

    const isSubscribed = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(userId),
                channel: new mongoose.Types.ObjectId(channelId)
            }
        }
    ])

    if (isSubscribed.length === 0) {
        return res
            .status(200)
            .json(
                {
                    "subscribed": false
                }
            )
    }

    return res
        .status(200)
        .json(
            {
                "subscribed": true
            }
        )
})

const subscribeFunction = asyncHandler(async (req, res) => {

    const { channelId } = req.params

    const userId = req.user._id.toString()
    // const user = req.user?._id

    // console.log("user ", user);
    // console.log("channelId", channelId);
    // console.log(userId === channelId);

    if (!userId) {
        throw new ApiError(400, "User does not exist")
    }

    if (!channelId) {
        throw new ApiError(400, "channel not defined")
    }

    const isSubscribed = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(userId),
                channel: new mongoose.Types.ObjectId(channelId)
            }
        }
    ])

    // console.log("isSubscribed: ", isSubscribed)

    if (userId === channelId) {

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    isSubscribed[0],
                    "same channel cannot subscribe oneself"
                )
            )
    }

    if (isSubscribed.length) {

        await Subscription.deleteOne(
            {
                subscriber: new mongoose.Types.ObjectId(userId),
                channel: new mongoose.Types.ObjectId(channelId)
            }
        )

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    isSubscribed[0],
                    "unsubscribed"
                )
            )
    }

    const subscriptionDetails = await Subscription.create({
        subscriber: userId,
        channel: channelId
    })



    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                subscriptionDetails,
                `subscribed ${channelId}`
            )
        )
})


export {
    subscribeFunction,
    isChannelSubscribed
}