import dotenv from "dotenv";
dotenv.config({
    path: "./.env"
})

import connectDB from "./db/index.js";

import { app } from "./app.js"

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log("Error: ", error);
        })
        app.listen(process.env.PORT || 7000, () => {
            console.log(`Server running at port ${process.env.PORT}`);
        })
    })
    .catch((error) => {
        console.log("MongoDB connection FAILED !!!", error);
    })