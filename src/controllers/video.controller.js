import { User } from "../models/user.model.js"
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.js"

const videoUpload = asyncHandler(async (req, res) => {

    // get video details
    // validate details - not empty
    // upload video and thumbanail
    // create video document
    // return response - "video uploaded"

    const { title, description, isPublished } = req.body

    console.log(req.body)

    if (
        [title, description, isPublished].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    let videoLocalPath;
    if (req.files && req.files.videoFile && req.files.videoFile.length > 0) {
        videoLocalPath = req.files.videoFile[0].path
    }

    let thumbnailLocalPath;
    if (req.files && req.files.thumbnail && req.files.thumbnail.length > 0) {
        thumbnailLocalPath = req.files.thumbnail[0].path
    }

    if (!(videoLocalPath)) {
        throw new ApiError(400, "video is required")
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "thumbnail is required")
    }

    const videoUrl = await uploadOnCloudinary(videoLocalPath)
    const thumbnailUrl = await uploadOnCloudinary(thumbnailLocalPath)

    if (!(videoUrl && thumbnailUrl)) {
        throw new ApiError(400, "video or thumbnail upload failed !")
    }

    const videoOwner = req.user?._id

    const videoDetails = await Video.create({
        videoFile: videoUrl.url,
        thumbnail: thumbnailUrl.url,
        title,
        description,
        isPublished,
        owner: videoOwner
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                videoDetails,
                "video uploaded and handled successfully"
            )
        )
})

const videoWatch = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const user = req?.user

    if (!videoId) {
        throw new ApiError(400, "video not defined")
    }

    if (!user) {
        throw new ApiError(400, "invalid request")
    }

    const watchHistoryLength = user.watchHistory.length

    console.log(watchHistoryLength)

    if ((watchHistoryLength === 0) || (user.watchHistory[watchHistoryLength - 1].toString() !== videoId)) {
        user.watchHistory.push(videoId)
        await user.save({ validateBeforeSave: false })
    }

    const video = await Video.findById(videoId)

    // increase the view of video by 1

    video.views += 1
    await video.save({ validateBeforeSave: false })

    // return the owner name

    const owner = (await User.findById(video.owner)).username

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    video,
                    owner
                },
                "video added to watch history successfully"
            )
        )
})

const exploreVideos = asyncHandler(async (req, res) => {

    const user = req?.user

    if (!user) {
        throw new ApiError(400, "invalid request")
    }

    // const videos = await Video.find()

    // const newArr = videos.map(async (videoDetails) => {
    //     videoDetails.title = (await User.findById(videoDetails.owner)).username
    //     console.log((await User.findById(videoDetails.owner)).avatar)
    //     console.log(videoDetails.title)
    // })

    const videos = await Video.aggregate([
        {
            $match: {}
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [
                    {
                        // $addFields: {}
                        $project: {
                            _id: 0,
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                ownerDetails: {
                    $first: "$ownerDetails"
                }
            }
        }
    ])

    // console.log(videos)

    return await res
        .status(200)
        .json(
            new ApiResponse(
                200,
                videos,
                "videos fetched successfully"
            )
        )
})

export {
    videoUpload,
    videoWatch,
    exploreVideos
}