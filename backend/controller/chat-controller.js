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


export const deleteMessage = asyncHandler(async (req, res, next) => {
	const { messageId } = req.params;
	const { id } = req.user;

	try {
		if (!messageId) {
			return next(new ErrorResponse("missing fields", 400));
		}

		await messageModel.findOneAndDelete({ _id: messageId }, { sender: id });
		return res.status(200).json({
			message: "Message deleted successfully",
			success: true,
		});
	} catch (error) {
		return next(new ErrorResponse(error.message, 500));
	}
});

export const updateMessage = asyncHandler(async (req, res, next) => {
	const { messageId } = req.params;
	const { id } = req.user;
	const { message } = req.body;

	try {
		if (!messageId || !message) {
			return next(new ErrorResponse("Missing field", 400));
		}
		let oldMessage = await messageModel.findById(messageId);
		if (!oldMessage) {
			return next(new ErrorResponse("No such a Message found", 404));
		}
		if (String(oldMessage.sender) !== String(id)) {
			return next(
				new ErrorResponse("You are not the owner of this message", 401)
			);
		}
		const updatedMessage = await messageModel.findOneAndUpdate(
			{ _id: messageId },
			{
				$set: {
					message: message,
				},
			},
			{
				new: true,
			}
		);
		
		return res.status(200).json({
			message: "Message updated Successfully",
			success: true,
			data: updatedMessage,
		});
	} catch (error) {
		return next(new ErrorResponse(error.message, 500));
	}
});


export const joinRoom = asyncHandler(async (req, res, next) => {
	const { roomId } = req.params;
	const { id } = req.user;
	try {
		if (!roomId) {
			return next(new ErrorResponse("Missing field", 400));
		}
		const findRoom = await chatroomModel.findOneAndUpdate(
			{ _id: roomId },
			{
				$push: {
					users: id,
				},
			},
			{
				new: true,
			}
		);
		res.status(200).json({
			message: "Room joined Successfully",
			success: true,
			data: findRoom,
		});
	} catch (error) {
		return next(new ErrorResponse(error.message, 500));
	}
});

export const leaveRoom = asyncHandler(async (req, res, next) => {
	const { roomId } = req.params;
	const { id } = req.user;
	try {
		if (!roomId) {
			return next(new ErrorResponse("Missing field", 400));
		}
		const findRoom = await chatroomModel.findOneAndUpdate(
			{ _id: roomId },
			{
				$pull: {
					users: id,
				},
			},
			{
				new: true,
			}
		);
		res.status(200).json({
			message: "Room left successfully",
			success: true,
			data: findRoom,
		});
	} catch (error) {
		return next(new ErrorResponse(error.message, 500));
	}
});