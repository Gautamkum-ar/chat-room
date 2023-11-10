import express from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import { createChatRoom, sendMessage } from "../controller/chat-controller.js";

const chatRoomRouter = express.Router();

chatRoomRouter.post("/chat/add-chatroom", checkAuth, createChatRoom);
chatRoomRouter.post("/chat/save-message", checkAuth, sendMessage);

export default chatRoomRouter;
