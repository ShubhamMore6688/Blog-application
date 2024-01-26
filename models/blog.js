import mongoose, { Schema } from "mongoose";

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    coverImageURL: {
        type: String
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
}, {timeStamp: true})

const Blog = mongoose.model("blogs", blogSchema);

export default Blog;