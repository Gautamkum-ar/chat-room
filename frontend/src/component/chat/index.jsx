import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth-context";
import { Input } from "../input";
import axios from "axios";

export const Chat = ({ socket }) => {
	const { userData, chatRoom, setChatRoom, messages } = useAuth();
	const [message, setMessage] = useState("");
	const [chatData, setChatData] = useState([]);
	const [createRoom, setCreateRoom] = useState(false);
	const [newRoom, setNewRoom] = useState("");
	const [joinedRoom, setJoinedRoom] = useState({});
	const [showChat, setShowChat] = useState(false);

	//filtering chat for seleceted room
	const displayChat = chatData?.filter(
		(chat) => chat.room.toString() === joinedRoom._id.toString()
	);

	// sending message to the room
	const sendMessage = async () => {
		if (message !== "") {
			const data = {
				message: message,
				username: userData._id,
				room: joinedRoom._id,
				time:
					new Date(Date.now()).getHours() +
					":" +
					new Date(Date.now()).getMinutes(),
			};
			await socket.emit("send_chat", data);
			setChatData([...chatData, data]);
			setMessage("");
		}
	};

	//creating new chat room
	const createRoomHandler = async () => {
		// socket.emit("create_room", newRoom);
		setCreateRoom(!createRoom);
		try {
			const response = await axios.post(
				"http://localhost:3005/v1/api/chat/add-chatroom",

				{ name: newRoom },
				{
					headers: {
						authorization: `Bearer ${localStorage.getItem("encodedToken")}`,
					},
				}
			);
			setChatRoom([...chatRoom, response.data.data]);
		} catch (error) {
			console.log(error);
		}
	};

	//handling room joining
	const handleJoinRoom = (roomId) => {
		socket.emit("join_room", roomId);
		setShowChat(true);
		setJoinedRoom(chatRoom.find((chat) => chat._id === roomId));
	};

	useEffect(() => {
		socket.on("recive_message", (data) => {
			setChatData((chat) => [...chat, data]);
		});
	}, [socket]);
	return (
		<div className="flex sm:w-full lg:w-[50%] bg-slate-900 shadow-lg  rounded-md h-[70%]">
			<div className="flex flex-col w-[30%] border-r-4 items-center">
				<h1 className="flex justify-center items-center h-8 w-full text-white  mt-2 capitalize">
					{userData?.username}
				</h1>
				<div className="flex w-full mt-4">
					<button
						onClick={() => setCreateRoom(!createRoom)}
						className="w-full border mx-2 rounded text-white hover:bg-green-500">
						New Chat Room
					</button>
				</div>
				{createRoom && (
					<div className="flex flex-col mx-2 mt-2 gap-2">
						<Input
							placeholder={"Room Name"}
							onChange={(e) => setNewRoom(e.target.value)}
						/>
						<button
							onClick={() => newRoom !== "" && createRoomHandler()}
							className="w-full border rounded text-white hover:bg-green-500">
							Create
						</button>
					</div>
				)}
				<div className="flex w-full h-auto mt-6 flex-col  overflow-y-scroll">
					{chatRoom?.map((elms) => (
						<p
							className="flex h-8 justify-between px-2 items-center text-[#fff] shadow-md w-full"
							key={elms._id}>
							{elms.name}
							<button
								className="text-green-500"
								onClick={() => handleJoinRoom(elms._id)}>
								Join
							</button>
						</p>
					))}
				</div>
			</div>

			{showChat ? (
				<div className="flex flex-col w-[70%]">
					<div className="flex justify-center items-center h-[10%] w-full">
						<h1 className="text-white font-semibold">
							Live Chat <b> {joinedRoom.name}</b>
						</h1>
					</div>
					<div className=" flex flex-col h-[80%] rounded-md border-2 mx-2 overflow-y-auto w-auto bg-white">
						{displayChat?.map((chat) => {
							const { _id, username, message, time } = chat;
							return (
								<p
									className={`flex ${
										username.toString() === userData._id.toString()
											? "justify-end  mt-1"
											: "justify-start mt-1 bg-slate-50"
									}`}
									key={_id}>
									{`${message}`}{" "}
									<span className="text-sm flex justify-center items-center text-[#888]">
										{time}
									</span>
								</p>
							);
						})}
					</div>
					<div className=" flex w-full h-[10%] justify-between items-center">
						<input
							className="flex p-1 rounded px-2 m-2 w-[80%]"
							type="text"
							placeholder="write a message"
							value={message}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									sendMessage();
								}
							}}
							onChange={(e) => setMessage(e.target.value)}
						/>
						<button
							onClick={sendMessage}
							className="flex  rounded m-2 border h-8 justify-center items-center w-[20%] text-white">
							Send
						</button>
					</div>
				</div>
			) : (
				<p className="flex justify-center items-center w-[70%] text-3xl text-blue-500">
					Please Join Room
				</p>
			)}
		</div>
	);
};
