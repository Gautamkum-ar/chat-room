import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import "./database/initial-db.js";
import AuthRouter from "./routes/auth-route.js";
import chatRoomRouter from "./routes/chatroom-route.js";
// import dotenv from "dotenv";

const app = express();
// dotenv.config();

app.use(cors({ origin: "*" }));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
//registering route
app.use("/v1/api", AuthRouter);
app.use("/v1/api", chatRoomRouter);

app.use("*", (req, res) => {
	res.status(404).json({
		success: false,
		message: "Route not found",
		method: `${req.method} ${req.url} is not allowed`,
	});
});

app.use((err, req, res, next) => {
	return res.status(err.statusCode || 500).json({
		statusCode: err.statusCode || 500,
		success: false,
		message: err.message,
	});
});

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
		socket.to(data.chatRoom).emit("recive_message", data);
	});
	socket.on("update_chat", (data) => {
		socket.to(data.chatRoom).emit("recive_updated", data);
	});

	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
	});
});

const port = 3005;
server.listen(port, () => {
	console.log(`App started on port ${port}`);
});
