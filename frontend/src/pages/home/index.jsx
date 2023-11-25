import io from "socket.io-client";
import { Chat, Loader } from "../../component";
import { useAuth } from "../../context/auth-context";

const socket = io.connect("http://localhost:3005/");

export const Home = () => {
	const { logoutHandler, isLoading } = useAuth();

	return (
		<div className="flex flex-col w-full items-center bg-slate-200 p-4 gap-4">
			<h1 className="text-2xl font-semibold">Welcome to chat app</h1>
			<button
				className="flex justify-center items-center bg-red-700 text-white p-2 absolute right-10 rounded-md hover:bg-transparent hover:text-red-700 hover:border-red-300 border px-6"
				onClick={logoutHandler}>
				Log Out
			</button>
			{isLoading ? <Loader /> : <Chat socket={socket} />}
		</div>
	);
};
