import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		users: [{ type: mongoose.Schema.Types.ObjectId }],
		// messages: [
		// 	{
		// 		userId: {
		// 			type: String,
		// 			required: true,
		// 		},
		// 		message: {
		// 			type: String,
		// 			required: true,
		// 		},
		// 	},
		// ],
	},
	{
		timestamps: true, // Saves createdAt and updatedAt as dates. createdAt will be saved with the timestamp of when the document
	}
);
export default mongoose.model("chatroom", chatRoomSchema);
