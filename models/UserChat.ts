
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: user-chat bridging table model schema for CapyTalk API server
 */

import mongoose from "mongoose";

export const UserChatSchema = new mongoose.Schema({
    userId: { type: Number, required: [true, 'userId is required'] },
    chatId: { type: Number, required: [true, 'chatId is required'] },
    userChatId: { type: Number, required: [true, 'userChatId is required'] },
});

const UserChat = mongoose.models.UserChat || mongoose.model('UserChat', UserChatSchema);
export default UserChat;