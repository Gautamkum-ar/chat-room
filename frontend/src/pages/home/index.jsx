import io from "socket.io-client";
import { useState } from "react";
import { Chat } from "../../component";
import { useAuth } from "../../context/auth-context";

const socket = io.connect("http://localhost:3005/");

export const Home = () => {
	const { logoutHandler } = useAuth();

	return (
		<div className="flex flex-col w-full h-screen items-center bg-slate-200 p-4 gap-4">
			<h1 className="text-2xl">Welcome to chat app</h1>
			<button
				className="flex justify-center items-center bg-red-700 text-white p-2 absolute right-10 rounded-md hover:bg-transparent hover:text-red-700 hover:border-red-300 border px-6"
				onClick={logoutHandler}>
				Log Out
			</button>
			<Chat socket={socket} />
		</div>
	);
};
