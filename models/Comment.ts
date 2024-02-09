
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: comment model schema for CapyTalk API server
 */

import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    email: { type: String, trim: true, maxlength: [255, 'title char limit is 80'] },
    content: { type: String, maxlength: [40000, 'content char limit is 10000'] },
    createDate: { type: Date, required: true, default: Date.now },
    commentId: { type: Number, required: [true, 'messageId is required'] }
});

const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
export default Comment;