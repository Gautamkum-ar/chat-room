import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth-context";
import { Input } from "../input";

export const Chat = ({ socket }) => {
	const {
		userData,
		chatRoom,
		setChatRoom,
		chatData,
		sendMessageApi,
		setChatData,
		deleteMessage,
		editMessage,
		creatRoom,
	} = useAuth();
	const [message, setMessage] = useState("");
	const [createRoom, setCreateRoom] = useState(false);
	const [newRoom, setNewRoom] = useState("");
	const [joinedRoom, setJoinedRoom] = useState({});
	const [showChat, setShowChat] = useState(false);
	const [userAction, setUserAction] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [editingData, setEditingData] = useState({});

	//filtering chat for seleceted room
	const displayChat = chatData?.filter(
		(chat) => chat.chatRoom === joinedRoom._id
	);
	// sending message to the room
	const sendMessage = async () => {
		if (message !== "") {
			const data = await sendMessageApi({
				message: message,
				roomId: joinedRoom._id,
				sender: userData._id,
				time:
					new Date(Date.now()).getHours() +
					":" +
					new Date(Date.now()).getMinutes(),
			});

			await socket.emit("send_chat", data);
			setChatData([...chatData, data]);
			setMessage("");
		}
	};

	//creating new chat room
	const createRoomHandler = async () => {
		// socket.emit("create_room", newRoom);
		setCreateRoom(!createRoom);
		creatRoom(newRoom);
	};

	// handling edit massage
	const handleEdit = async () => {
		const data = await editMessage(message, editingData._id);
		socket.emit("update_chat", data);
		setIsEdit(false);
		setMessage("");
	};

	//handling room joining
	const handleJoinRoom = (roomId) => {
		console.log(roomId);
		socket.emit("join_room", roomId);
		setShowChat(true);
		setJoinedRoom(chatRoom.find((chat) => chat._id === roomId));
	};

	useEffect(() => {
		socket.on("recive_message", (data) => {
			setChatData((chat) => [...chat, data]);
		});
	}, [socket]);
	
	useEffect(() => {
		socket.on("recive_updated", (data) => {
			console.log(data);
			setChatData(
				chatData.map((chat) =>
					chat._id.toString() === data._id.toString() ? { ...data } : chat
				)
			);
		});
	}, [socket]);

	return (
		<div className="flex sm:w-full lg:w-[50%] bg-slate-900 shadow-lg  rounded-md h-[70vh]">
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
				<div className="flex w-full h-auto mt-6 flex-col  overflow-y-auto">
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
				<div className="flex flex-col h-[100%] w-[70%] overflow-hidden">
					<div className="flex justify-center items-center h-[10%] w-full">
						<h1 className="text-white font-semibold">
							Live Chat <b> {joinedRoom.name}</b>
						</h1>
					</div>
					<div className=" flex flex-col  rounded-md border-2 mx-2  h-[80%] w-auto bg-white overflow-y-auto">
						{displayChat?.map((chat) => {
							const { _id, sender, message, time, chatRoom } = chat;
							return (
								<div
									onClick={() => setUserAction(true)}
									className={`flex flex-col ${
										sender.toString() === userData._id.toString()
											? "items-end  mt-1 mr-4"
											: "items-start mt-1 "
									} relative`}
									key={_id}>
									{message}
									{sender.toString() === userData._id.toString() && (
										<p className="flex  bg-white  text-[12px] gap-2 ">
											<button
												onClick={() => deleteMessage(_id)}
												className="text-red-400">
												Delete
											</button>
											<button
												onClick={() => {
													setEditingData(chat);
													setMessage(message);
													setIsEdit(true);
												}}
												className="text-yellow-600">
												Edit
											</button>
										</p>
									)}
									<span className="text-[10px] flex justify-center items-center text-[#888]">
										{time}
									</span>
								</div>
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
									isEdit ? handleEdit() : sendMessage();
								}
							}}
							onChange={(e) => setMessage(e.target.value)}
						/>
						<button
							onClick={() => {
								isEdit ? handleEdit() : sendMessage();
							}}
							className="flex  rounded m-2 border h-8 justify-center items-center w-[20%] text-white">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="white"
								className="h-6 w-6 ml-2 transform rotate-90">
								<path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
							</svg>
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
