import mongoose, { Schema } from "mongoose";

const commentSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },

    blogId: {
        type: Schema.Types.ObjectId,
        ref: "blogs"
    }
})

const Comment = mongoose.model("comment", commentSchema);

export default Comment;