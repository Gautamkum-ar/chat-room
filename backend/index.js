import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import "./database/initial-db.js";
import AuthRouter from "./routes/auth-route.js";
import messageModel from "./model/chat-model.js";
import chatRoomRouter from "./routes/chatroom-route.js";
import { time } from "console";
// import dotenv from "dotenv";

const app = express();
// dotenv.config();

app.use(cors({ origin: "*" }));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
//registering route
app.use("/v1/api", AuthRouter);
app.use("/v1/api", chatRoomRouter);

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	console.log("a user connected", socket.id);

	socket.on("join_room", (data) => {
		socket.join(data);
		console.log(`user ${socket.id} join the room ${data}`);
	});
	socket.on("send_chat", (data) => {
		// const message = new messageModel({
		// 	chatRoom: data.room,
		// 	sender: data.username,
		// 	message: data.message,
		// 	time: data.time,
		// });

		// message.save();
		socket.to(data.room).emit("recive_message", data);
	});

	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
	});
});

const port = 3005;
server.listen(port, () => {
	console.log(`App started on port ${port}`);
});
