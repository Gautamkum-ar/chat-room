import {  useState } from "react";
import { useAuth } from "../../context/auth-context";
import { ChatRooms } from "./chatrooms";
import { Chatbox } from "./chatBox";

export const Chat = ({ socket }) => {
	const { userData, chatRoom } = useAuth();
	const [joinedRoom, setJoinedRoom] = useState({});
	const [showChat, setShowChat] = useState(false);

	return (
		<div className="flex sm:w-full lg:w-[60%] bg-slate-900 shadow-lg  rounded-md h-[70vh]">
			<ChatRooms
				socket={socket}
				setJoinedRoom={setJoinedRoom}
				setShowChat={setShowChat}
			/>
			{showChat &&
			chatRoom
				?.find((user) => user._id === joinedRoom._id)
				?.users.find((elms) => elms._id === userData._id) ? (
				<Chatbox socket={socket} joinedRoom={joinedRoom} />
			) : (
				<p className="flex justify-center items-center w-[70%] text-3xl text-blue-500">
					Please Join Room
				</p>
			)}
		</div>
	);
};
