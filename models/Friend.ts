


import mongoose from "mongoose";
import { ChatSchema } from "./Chat";

const FriendSchema = new mongoose.Schema({
    userId: { type: Number, required: [true, 'userId is required'] },
    friendId: { type: Number, required: [true, 'friendId is required'] },
});

const Friend = mongoose.models.Friend || mongoose.model('Friend', FriendSchema);
export default Friend;