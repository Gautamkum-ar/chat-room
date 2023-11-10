import express from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import {
	createChatRoom,
	deleteMessage,
	sendMessage,
    updateMessage,
} from "../controller/chat-controller.js";

const chatRoomRouter = express.Router();

chatRoomRouter.post("/chat/add-chatroom", checkAuth, createChatRoom);
chatRoomRouter.post("/chat/save-message", checkAuth, sendMessage);
chatRoomRouter.delete(
	"/chat/delete-message/:messageId",
	checkAuth,
	deleteMessage
);
chatRoomRouter.post('/chat/update/:messageId',checkAuth,updateMessage)

export default chatRoomRouter;
