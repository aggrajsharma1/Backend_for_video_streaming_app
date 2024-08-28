import mongoose, { Schema } from "mongoose"

const playlistSchema = new Schema({
    videoCount: {
        type: Number
    },
    videos: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ]
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

export const Playlist = mongoose.model("Playlist", playlistSchema)