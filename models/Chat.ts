
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: chat model schema for CapyTalk API server
 */

import mongoose from "mongoose";

export const ChatSchema = new mongoose.Schema({
    title: { type: String, required: true, default: "New Chat", maxlength: [80, 'title char limit is 80'] },
    date: { type: Date, required: true, default: Date.now },
    chatId: { type: Number, required: [true, 'chatId is required'] },
});

const Chat = mongoose.models.Chat || mongoose.model('Chat', ChatSchema);
export default Chat;