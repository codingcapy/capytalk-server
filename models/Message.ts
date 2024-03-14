
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: message model schema for CapyTalk API server
 */

import mongoose from "mongoose";

export const MessageSchema = new mongoose.Schema({
    content: { type: String, required: true, default: "New Chat", maxlength: [25000, 'username char limit is 25000'] },
    date: { type: Date, required: true, default: Date.now },
    username: { type: String, required: [true, 'username is required'] },
    chatId: { type: Number, required: [true, 'chatId is required'] },
    messageId: { type: Number, required: [true, 'chatId is required'] },
});

const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);
export default Message;