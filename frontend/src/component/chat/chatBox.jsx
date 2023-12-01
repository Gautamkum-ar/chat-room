import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/auth-context";

export const Chatbox = ({ joinedRoom, socket }) => {
	const {
		userData,
		chatData,
		sendMessageApi,
		setChatData,
		deleteMessage,
		editMessage,
	} = useAuth();
	const [userAction, setUserAction] = useState(false);
	const [message, setMessage] = useState("");
	const [isEdit, setIsEdit] = useState(false);
	const [editingData, setEditingData] = useState({});

	const messageBoxRef = useRef(null);
	//scroll to bottom
	const scrollToBottom = () => {
		messageBoxRef.current?.scrollIntoView({ behavior: "smooth" });
	};

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
	// handling edit massage
	const handleEdit = async () => {
		const data = await editMessage(message, editingData._id);
		socket.emit("update_chat", data);
		setIsEdit(false);
		setMessage("");
	};
	useEffect(() => {
		socket.on("recive_message", (data) => {
			setChatData((chat) => [...chat, data]);
		});
	}, [socket]);

	useEffect(() => {
		socket.on("recive_updated", (data) => {
			setChatData(
				chatData.map((chat) =>
					chat._id.toString() === data._id.toString() ? { ...data } : chat
				)
			);
		});
	}, [socket]);
	useEffect(() => {
		scrollToBottom();
	}, [displayChat]);
	return (
		<div className="flex flex-col h-[100%] w-[70%] overflow-hidden">
			<div className="flex flex-col justify-center items-center h-[13%] w-full">
				<h1 className="text-white font-semibold">
					<b> {joinedRoom.name}</b>
				</h1>
				<p className="flex text-white text-[10px] gap-1">
					{joinedRoom?.users?.length} members
				</p>
			</div>
			<div className=" flex flex-col  rounded-md border-2 mx-2  h-[80%] w-auto bg-white overflow-y-auto">
				{displayChat?.map((chat) => {
					const { _id, sender, message, time } = chat;
					return (
						<div
							onClick={() => setUserAction(!userAction)}
							className={`flex p-3 rounded-md text-white flex-col bg-slate-500 w-[48%] ${
								sender._id.toString() === userData._id.toString()
									? "items-end mt-1 mr-1 self-end"
									: "items-start mt-1 ml-1 "
							} relative`}
							key={_id}>
							<p className="flex text-[10px] absolute top-0 left-1 text-blue-200">
								{sender.username}
							</p>
							{message}
							{sender._id === userData._id.toString() && (
								<p className="flex absolute top-0 right-1 text-[10px] gap-2 font-semibold">
									<button
										onClick={() => deleteMessage(_id)}
										className="text-red-300">
										Delete
									</button>
									<button
										onClick={() => {
											setEditingData(chat);
											setMessage(message);
											setIsEdit(true);
										}}
										className="text-yellow-300">
										Edit
									</button>
								</p>
							)}
							<span className="text-[10px] flex justify-center items-center">
								{time}
							</span>
						</div>
					);
				})}
				<div ref={messageBoxRef} />
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
	);
};
