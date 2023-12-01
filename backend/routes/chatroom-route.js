import express from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import {
	createChatRoom,
	deleteMessage,
	getAllChats,
	joinRoom,
	leaveRoom,
	sendMessage,
	updateMessage,
} from "../controller/chat-controller.js";

const chatRoomRouter = express.Router();

chatRoomRouter.post("/chat/add-chatroom", checkAuth, createChatRoom);
chatRoomRouter.get("/chatroom/rooms", getAllChats);
chatRoomRouter.post("/chat/save-message", checkAuth, sendMessage);
chatRoomRouter.delete(
	"/chat/delete-message/:messageId",
	checkAuth,
	deleteMessage
);
chatRoomRouter.post("/chat/update/:messageId", checkAuth, updateMessage);
chatRoomRouter.post("/chatroom/join/:roomId", checkAuth, joinRoom);
chatRoomRouter.delete("/chatroom/leave-room/:roomId", checkAuth, leaveRoom);

export default chatRoomRouter;
