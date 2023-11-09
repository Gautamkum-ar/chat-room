import asyncHandler from "../handler/catchAsync.js";
import ErrorResponse from "../handler/error.js";
import chatModel from "../model/chat-model.js";
import chatroomModel from "../model/chatroom-model.js";
import userModel from "../model/user-model.js";
import { generateToken } from "../services/token.js";

export const signUp = asyncHandler(async (req, res, next) => {
	const { username, password, email } = req.body;
	try {
		if (!username || !password || !email) {
			return next(new ErrorResponse("Missing Fields", 400));
		}
		// const checkuser = userModel.findOne({ email: email });
		// if (checkuser) {
		// 	return next(new ErrorResponse("User Already exist", 400));
		// }
		const newUser = new userModel({
			username: username,
			password: password,
			email: email,
		});
		await newUser.save();
		return res
			.status(201)
			.json({ success: true, message: "Signup Successfully", data: newUser });
	} catch (error) {
		return next(new ErrorResponse(error.message, 500));
	}
});

export const Login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;
	try {
		if (!password || !email) {
			return next(new ErrorResponse("Missing Fields", 400));
		}
		const findUser = await userModel.findOne({ email: email });
		if (!findUser) {
			return next(new ErrorResponse("User Not found", 404));
		}
		if (findUser.password !== password) {
			return next(new ErrorResponse("Password Not Match", 400));
		}
		const token = generateToken({ id: findUser._id });

		return res.status(200).json({
			message: "Login Successfully",
			success: true,
			data: { encodedToken: token, findUser },
		});
	} catch (error) {
		return next(new ErrorResponse(error.message, 500));
	}
});

export const getProfile = asyncHandler(async (req, res, next) => {
	const { id } = req.user;
	try {
		const findUser = await userModel.findById({ _id: id });
		const chatroom = await chatroomModel.find().select("-__v");
		const chats = await chatModel.find();
		res.status(200).json({
			message: "Successfuly Get Profile",
			success: true,
			data: { findUser, chatroom, chats },
		});
	} catch (error) {
		next(new ErrorResponse(error.message, 500));
	}
});
