
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: controller for CapyTalk API server
 */

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "./models/User";
import Chat from "./models/Chat";
import Message from "./models/Message";
import Comment from "./models/Comment";
import UserChat from "./models/UserChat";
import UserFriend from "./models/UserFriend";

const saltRounds = 6;

export interface IDecodedUser {
    userId: number
};

export async function validateUser(req: Request, res: Response) {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username: username });
        if (!user) return res.json({ result: { user: null, token: null } });
        bcrypt.compare(password, user?.password || "", function (err, result) {
            if (err) {
                console.log(err);
                return res.status(500).send("Internal Server Error");
            }
            if (result === true) {
                const token = jwt.sign({ id: user?.id }, "secret", { expiresIn: "2days" });
                res.json({ result: { user, token } });
            }
            else {
                return res.json({ result: { user: null, token: null } });
            }
        })
    }
    catch (err2) {
        console.log(err2);
        res.status(500).json({ success: false, message: "error during validation" })
    }
}

export async function decryptToken(req: Request, res: Response) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(403).send("Header does not exist");
            return "";
        }
        const token = authHeader.split(" ")[1];
        const decodedUser = jwt.verify(token, "secret");
        const user = searchUserById((decodedUser as IDecodedUser).userId);
        res.json({ result: { user, token } });
    }
    catch (err) {
        res.status(401).json({ err });
    }
}

export async function searchUserById(id: number) {
    const user = User.findOne({ userId: id });
    // if (!user) throw new Error("User not found");
    return user;
}

export async function createUser(req: Request, res: Response) {
    try {
        const users = await User.find({});
        const userId = users.length === 0 ? 1 : users[users.length - 1].userId + 1;
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        const displayName = username;
        if (users.find((user: any) => user.username === username.toString())) {
            return res.json({ success: false, message: "Username already exists" });
        }
        if (users.find((user: any) => user.email === email.toString())) {
            return res.json({ success: false, message: "An account associated with that email already exists" });
        }
        else {
            const encrypted = await bcrypt.hash(password, saltRounds);
            const user = await User.create({ username, password: encrypted, email, displayName, userId });
            res.status(200).json({ success: true, message: "Sign up successful!" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Error creating user" });
    }
}

export async function getUser(req: Request, res: Response) {
    try {
        const userId = req.params.userId;
        const user = await User.findOne({ userId: parseInt(userId) });
        res.status(200).json(user);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Error getting user" });
    }
}

export async function updateUser(req: Request, res: Response) {
    try {
        const userId = parseInt(req.params.userId);
        const incomingUser = await req.body;
        const incomingPassword = incomingUser.password;
        const encrypted = await bcrypt.hash(incomingPassword, saltRounds);
        const updatedUser = await User.findOneAndUpdate(
            { userId: userId },
            { username: incomingUser.username, password: encrypted, userId: incomingUser.userId },
            { new: true }
        );
        res.status(200).json({ success: true });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Error updating user" });
    }
}

export async function addFriend(req: Request, res: Response) {
    try {
        const inputFriend = req.body.friend;
        const friend = await User.findOne({ username: inputFriend });
        if (!friend) {
            return res.json({ success: false, message: "User does not exist" });
        }
        const inputUser = req.body.username;
        const user = await User.findOne({ username: inputUser });
        const userFriend = await UserFriend.findOne({ userId: user.userId, friendId: friend.userId })
        if (userFriend) {
            return res.json({ success: false, message: "User is already your friend!" });
        }
        if (inputFriend == user.username) {
            return res.json({ success: false, message: "That's yourself!" });
        }
        const userFriends = await UserFriend.find({})
        const userFriendId = userFriends.length === 0 ? 1 : userFriends[userFriends.length - 1].userFriendId + 1;
        const userFriendId2 = userFriendId + 1;
        const displayName = friend.username;
        const displayName2 = user.username;
        await UserFriend.create({ userId: user.userId, friendId: friend.userId, userFriendId, displayName });
        await UserFriend.create({ userId: friend.userId, friendId: user.userId, userFriendId: userFriendId2, displayName: displayName2 });
        res.status(200).json({ success: true, message: "Friend added successfully!" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Error adding friend" });
    }
}

export async function getFriends(req: Request, res: Response) {
    try {
        const userId = req.params.userId;
        const userFriends = await UserFriend.find({ userId: parseInt(userId) });
        const userPromises = userFriends.map(async (userFriend) => {
            return await User.findOne({ userId: userFriend.friendId }).lean();
        });
        const friends = await Promise.all(userPromises);
        res.status(200).json(friends);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Error getting friends" });
    }
}

export async function blockFriend(req: Request, res: Response) {
    try {
        const inputFriend = req.body.friend;
        const friend = await User.findOne({ username: inputFriend });
        const inputUser = req.body.user;
        const user = await User.findOne({ username: inputUser });
        const userFriend = await UserFriend.findOneAndUpdate({ userId: user.userId, friendId: friend.userId }, { blocked: true })
        res.status(200).json({ success: true, message: "Friend added successfully!" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Error blocking friend" });
    }
}

export async function createChat(req: Request, res: Response) {
    try {
        const userChats = await UserChat.find({});
        const userChatId = userChats.length === 0 ? 1 : userChats[userChats.length - 1].userChatId + 1;
        const userChatId2 = userChatId + 1;
        const chats = await Chat.find({});
        const chatId = chats.length === 0 ? 1 : chats[chats.length - 1].chatId + 1;
        const title = req.body.title;
        const incomingUser = req.body.user;
        const user = await User.findOne({ username: incomingUser })
        const incomingFriend = req.body.friend;
        const friend = await User.findOne({ username: incomingFriend })
        await Chat.create({ title, chatId });
        await UserChat.create({ userId: user.userId, chatId, userChatId });
        await UserChat.create({ userId: friend.userId, chatId, userChatId: userChatId2 });
        res.status(200).json({ success: true, message: "Chat added successfully!" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Error creating chat" });
    }
}

export async function getChats(req: Request, res: Response) {
    try {
        const userId = req.params.userId;
        const userChats = await UserChat.find({ userId: parseInt(userId) });
        const requestedChats = userChats.map(async (chat) => {
            return await Chat.findOne({ chatId: chat.chatId });
        });
        const chats = await Promise.all(requestedChats);
        res.status(200).json(chats);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Error getting chats" });
    }
}

export async function getChat(req: Request, res: Response) {
    try {
        const chatId = req.params.chatId;
        const chat = await Chat.findOne({ chatId: parseInt(chatId) });
        res.status(200).json(chat);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Error getting chat" });
    }
}

export async function leaveChat(req: Request, res: Response) {
    try {
        const userId = req.body.userId;
        const chatId = req.body.chatId;
        await UserChat.findOneAndDelete({ userId, chatId })
        const userChat = await UserChat.find({ chatId })
        if (userChat.length === 0) {
            await Chat.findOneAndDelete({ chatId })
            await Message.deleteMany({ chatId })
        }
        res.status(200).json({ success: true });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Error leaving chat" });
    }
}

export async function createMessage(req: Request, res: Response) {
    const inputContent = req.body.content;
    const user = req.body.user;
    const chatId = req.body.chatId;
    const replyContent = req.body.replyContent;
    const replyUsername = req.body.replyUsername;
    const messages = await Message.find({});
    const messageId = messages.length === 0 ? 1 : messages[messages.length - 1].messageId + 1;
    try {
        await Message.create({ content: inputContent, replyContent, replyUsername, username: user, chatId: parseInt(chatId), messageId });
        res.status(200).json({ success: true, message: "Message added successfully!" });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: "Error creating message" });
    }
}

export async function getMessages(req: Request, res: Response) {
    try {
        const chatId = req.params.chatId;
        const messages = await Message.find({ chatId: parseInt(chatId) })
        res.status(200).json(messages)
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Error getting messages" });
    }
}

export async function updateMessage(req: Request, res: Response) {
    try {
        const messageId = req.params.messageId;
        const content = req.body.content
        const message = await Message.findOneAndUpdate({ messageId }, { content })
        res.status(200).json({ success: true });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Error updating message" });
    }
}

export async function createComment(req: Request, res: Response) {
    try {
        const comments = await Comment.find({});
        const commentId = comments.length === 0 ? 1 : comments[comments.length - 1].commentId + 1;
        const email = req.body.email;
        const content = req.body.content;
        const comment = await Comment.create({ email, content, commentId });
        res.status(200).json({ success: true });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Error sending comment" });
    }
}