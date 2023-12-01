import { useState } from "react";
import { useAuth } from "../../context/auth-context";
import { Input } from "../input";

export const ChatRooms = ({ socket, setJoinedRoom, setShowChat }) => {
	const {
		userData,
		chatRoom,
		handleJJoinRoomApi,
		handleLeaveRoomApi,
		creatRoom,
	} = useAuth();

	const [createRoom, setCreateRoom] = useState(false);
	const [newRoom, setNewRoom] = useState("");

	const checkPresentInRoom = (room) => {
		const IsPresentInRoom = room.users.find(
			(user) => user._id === userData._id
		);
		return IsPresentInRoom ? true : false;
	};
	//creating new chat room
	const createRoomHandler = async () => {
		// socket.emit("create_room", newRoom);
		setCreateRoom(!createRoom);
		creatRoom(newRoom);
	};

	//handling room joining
	const handleJoinRoom = (roomId) => {
		handleJJoinRoomApi(roomId);
		socket.emit("join_room", roomId);
		setShowChat(true);
		setJoinedRoom(chatRoom.find((chat) => chat._id === roomId));
	};
	// handle remove from room

	const handleRemoveFromRoom = (roomId) => {
		handleLeaveRoomApi(roomId);
		// socket.emit("remove_from_room", roomId);
		setShowChat(false);
	};
	return (
		<div className="flex flex-col w-[40%] border-r-4 items-center">
			<h1 className="flex justify-center items-center h-8 w-full text-white  mt-2 capitalize">
				{userData?.username}
			</h1>
			<div className="flex w-full mt-4">
				<button
					onClick={() => setCreateRoom(!createRoom)}
					className="w-[90%] border mx-auto rounded text-white hover:bg-green-500  ">
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
					<div
						className="flex h-8 justify-between px-2 items-center text-[#fff] shadow-md w-full"
						key={elms._id}>
						<p
							onClick={() => {
								setShowChat(true);
								setJoinedRoom(chatRoom.find((chat) => chat._id === elms._id));
							}}
							className="flex h-8 justify-between px-2 items-center text-[#fff] shadow-md w-full">
							{elms.name}
						</p>
						<button
							className={`${
								checkPresentInRoom(elms) ? "text-red-500" : "text-green-500"
							} text-sm z-10`}
							onClick={() => {
								if (checkPresentInRoom(elms)) {
									handleRemoveFromRoom(elms._id);
								} else {
									handleJoinRoom(elms._id);
								}
							}}>
							{checkPresentInRoom(elms) ? "Leave" : "Join"}
						</button>
					</div>
				))}
			</div>
		</div>
	);
};
