
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: user model schema for CapyTalk API server
 */

import mongoose from "mongoose";
import { ChatSchema } from "./Chat";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: [true, 'username is required'], trim: true, maxlength: [80, 'username char limit is 80'] },
    password: { type: String, required: [true, 'password is required'], maxlength: [80, 'password char limit is 80'] },
    email: { type: String, required: [true, 'email is required'], maxlength: [255, 'email char limit is 255'] },
    displayName: { type: String, required: [true, 'displayName is required'], maxlength: [80, 'displayName char limit is 80'] },
    date: { type: Date, required: true, default: Date.now },
    active: { type: Boolean, required: true, default: true },
    userId: { type: Number, required: [true, 'userId is required'] },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;