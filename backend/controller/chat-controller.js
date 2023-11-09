import asyncHandler from "../handler/catchAsync.js";
import ErrorResponse from "../handler/error.js";
import chatroomModel from "../model/chatroom-model.js";
import userModel from "../model/user-model.js";

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
