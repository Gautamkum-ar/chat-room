import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		chatRoom: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "chatroom",
			required: true,
		},
		time: {
			type: String,
		},
	},
	{ timestamps: true }
);
export default mongoose.model("Message", messageSchema);
