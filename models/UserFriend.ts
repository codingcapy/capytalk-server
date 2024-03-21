
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: user-friend bridging table model schema for CapyTalk API server
 */

import mongoose from "mongoose";

const UserFriendSchema = new mongoose.Schema({
    userId: { type: Number, required: [true, 'userId is required'] },
    friendId: { type: Number, required: [true, 'userId is required'] },
    blocked: { type: Boolean, required: true, default: false },
    displayName: { type: String, required: [true, 'displayName is required'], trim: true, maxlength: [32, 'displayName char limit is 32'] },
    userFriendId: { type: Number, required: [true, 'userId is required'] },
});

const UserFriend = mongoose.models.UserFriend || mongoose.model('UserFriend', UserFriendSchema);
export default UserFriend;