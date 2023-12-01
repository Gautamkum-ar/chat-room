import mongoose from "mongoose";

const userModel = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		// messages: [
		// 	{
		// 		type: mongoose.Schema.Types.ObjectId,
		// 		ref: "Message",
		// 	},
		// ],
		// chatroom: [
		// 	{
		// 		type: mongoose.Schema.Types.ObjectId,
		// 		ref: "chatroom",
		// 	},
		// ],
	},
	{
		timestamps: true,
	}
);
export default mongoose.model("users", userModel);
