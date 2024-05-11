import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Like } from "../models/like.model.js";

// const likeFunction = asyncHandler(async (req, res) => {

//     // get values
//     // validate values if not empty
//     // check if user and channel ids are same
//     // check if already liked
//     // return response "liked ${channel}"

//     const { videoId } = req.params
//     const userId = req.user?._id.toString()

//     if (!userId) {
//         throw new ApiError(400, "invalid request")
//     }

//     if (!videoId) {
//         throw new ApiError(400, "video not defined")
//     }

//     const isLiked = await Like.aggregate([
//         {
//             $match: {
//                 user: new mongoose.Types.ObjectId(userId),
//                 video: new mongoose.Types.ObjectId(videoId)
//             }
//         }
//     ])

//     if (isLiked.length) {
//         return res
//             .status(200)
//             .json(
//                 new ApiResponse(
//                     200,
//                     isLiked[0],
//                     "already liked"
//                 )
//             )
//     }

//     const likeDetails = await Like.create({
//         user: userId,
//         video: videoId
//     })

//     return res
//         .status(200)
//         .json(
//             new ApiResponse(
//                 200,
//                 likeDetails,
//                 `liked ${videoId}`
//             )
//         )

// })

const isVideoLiked = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    const userId = req?.user._id.toString()

    if (!videoId) {
        throw new ApiError(400, "video not defined")
    }

    if (!userId) {
        throw new ApiError(400, "invalid request")
    }

    const isLiked = await Like.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId),
                video: new mongoose.Types.ObjectId(videoId)
            }
        }
    ])

    if (isLiked.length === 0) {
        return res
            .status(200)
            .json(
                {
                    "liked": false
                }
            )
    }

    return res
        .status(200)
        .json(
            {
                "liked": true
            }
        )
})

const likeFunction = asyncHandler(async (req, res) => {

    // get values
    // validate values if not empty
    // check if user and channel ids are same
    // check if already liked
    // return response "liked ${channel}"

    const { videoId } = req.params
    const userId = req.user?._id.toString()

    if (!userId) {
        throw new ApiError(400, "invalid request")
    }

    if (!videoId) {
        throw new ApiError(400, "video not defined")
    }

    const isLiked = await Like.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId),
                video: new mongoose.Types.ObjectId(videoId)
            }
        }
    ])

    if (isLiked.length) {

        await Like.deleteOne(
            {
                user: new mongoose.Types.ObjectId(userId),
                video: new mongoose.Types.ObjectId(videoId)
            }
        )

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    isLiked[0],
                    "unliked"
                )
            )
    }

    const likeDetails = await Like.create({
        user: userId,
        video: videoId
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likeDetails,
                `liked ${videoId}`
            )
        )

})

export {
    likeFunction,
    isVideoLiked
}