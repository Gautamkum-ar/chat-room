import asyncHandler from "../handler/catchAsync.js";
import ErrorResponse from "../handler/error.js";
import chatroomModel from "../model/chatroom-model.js";
import userModel from "../model/user-model.js";
import messageModel from "../model/chat-model.js";

export const createChatRoom = asyncHandler(async (req, res, next) => {
	const { name } = req.body;
	const { id } = req.user;
	console.log(name);
	try {
		if (!name) {
			return next(new ErrorResponse("Missing Fields", 400));
		}
		const newRoom = new chatroomModel({
			name: name,
		});
		await newRoom.save();

		res.status(201).json({
			success: true,
			message: "Room created successfully",
			data: newRoom,
		});
	} catch (error) {
		return next(new ErrorResponse(error.message, 500));
	}
});

export const sendMessage = asyncHandler(async (req, res, next) => {
	const { message, sender, roomId, time } = req.body;
	try {
		if (!message || !sender || !roomId || !time) {
			return next(new ErrorResponse("Mising Fields", 400));
		}
		const newMessage = new messageModel({
			message: message,
			sender: sender,
			chatRoom: roomId,
			time: time,
		});
		await newMessage.save();
		return res.status(200).json({
			message: "Message save successfully",
			success: true,
			data: newMessage,
		});
	} catch (error) {
		return next(new ErrorResponse(error.message, 500));
	}
});