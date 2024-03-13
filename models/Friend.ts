
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: friend model schema for CapyTalk API server
 */

import mongoose from "mongoose";

const FriendSchema = new mongoose.Schema({
    userId: { type: Number, required: [true, 'userId is required'] },
    friendId: { type: Number, required: [true, 'friendId is required'] },
});

const Friend = mongoose.models.Friend || mongoose.model('Friend', FriendSchema);
export default Friend;