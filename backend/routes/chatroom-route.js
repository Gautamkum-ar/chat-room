import express from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import { createChatRoom } from "../controller/chat-controller.js";

const chatRoomRouter = express.Router();

chatRoomRouter.post("/chat/add-chatroom", checkAuth, createChatRoom);

export default chatRoomRouter;
