import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
	const [flag, setFlag] = useState(true);
	const [userData, setUserData] = useState({});
	const [chatRoom, setChatRoom] = useState([]);
	const [chatData, setChatData] = useState([]);
	const [isLoading, setisLoading] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [showToaster, setShowToaster] = useState({
		status: false,
		message: "",
		color: "",
	});
	const navigate = useNavigate();

	//toaster
	const toast = {
		error: (message) => {
			setShowToaster({
				...showToaster,
				message: message,
				status: true,
				color: "red",
			});
			setTimeout(() => {
				setShowToaster({
					...showToaster,
					status: false,
				});
			}, 3000);
		},
		success: (message) => {
			setShowToaster({
				...showToaster,
				message: message,
				status: true,
				color: "green",
			});
			setTimeout(() => {
				setShowToaster({
					...showToaster,
					status: false,
				});
			}, 3000);
		},
	};

	// login user in app
	const baseUrl = process.env.REACT_APP_BASE_URL;
	const login = async (loginData) => {
		if (loginData.email === "" || loginData.password === "") {
			return toast.error("Please enter all fields");
		}
		setisLoading(true);
		try {
			const response = await axios.post(`${baseUrl}/auth/login`, {
				...loginData,
			});
			if (response.status === 200) {
				setIsAuthenticated(true);
				setisLoading(false);
				toast.success(response.data.message);
				localStorage.setItem("encodedToken", response.data.data.encodedToken);
			}
		} catch (error) {
			toast.error(error.response.data.message);
			setisLoading(false);
		}
	};
	// handle join room api
	const handleJJoinRoomApi = async (roomId) => {
		try {
			const response = await axios.post(
				`${baseUrl}/chatroom/join/${roomId}`,
				{},
				{
					headers: {
						authorization: `Bearer ${localStorage.getItem("encodedToken")}`,
					},
				}
			);
			toast.success(response.data.message);
			setChatRoom(
				chatRoom.map((room) =>
					room._id === response.data.data._id ? response.data.data : room
				)
			);
		} catch (error) {
			toast.error(error.response.data.message);

			console.log(error);
		}
	};

	// leave room api
	const handleLeaveRoomApi = async (roomId) => {
		try {
			const response = await axios.delete(
				`${baseUrl}/chatroom/leave-room/${roomId}`,
				{
					headers: {
						authorization: `Bearer ${localStorage.getItem("encodedToken")}`,
					},
				}
			);
			toast.success(response.data.message);
			setChatRoom(
				chatRoom.map((room) =>
					room._id === response.data.data._id ? response.data.data : room
				)
			);
		} catch (err) {
			console.log(err);
			toast.error(err.response.data.message);
		}
	};

	// logout
	const logoutHandler = () => {
		setIsAuthenticated(false);
		localStorage.removeItem("encodedToken");
	};

	// registering new user
	const signup = async (signupData) => {
		setisLoading(true);

		try {
			const response = await axios.post(`${baseUrl}/auth/signup`, {
				...signupData,
			});
			if (response.status === 201) {
				setisLoading(false);
				toast.success(response.data.message);
				alert("Successfully signed up!");
				navigate("/login");
			}
		} catch (error) {
			toast.error(error.response.data.message);
			setisLoading(false);
		}
	};

	// loading profile of user

	const loadUser = async () => {
		const token = localStorage.getItem("encodedToken");
		if (flag) {
			setFlag(false);
			try {
				setisLoading(true);

				const response = await axios.get(`${baseUrl}/auth/get-user`, {
					headers: {
						authorization: `Bearer ${token}`,
					},
				});
				if (response) {
					setisLoading(false);

					setUserData(response?.data?.data?.findUser);
					setChatRoom(response?.data?.data?.chatroom);
					setChatData(response?.data?.data?.chats);
					setIsAuthenticated(true);
				}
			} catch (error) {
				toast.error(error.response.data.message);
				setisLoading(false);
			} finally {
				setisLoading(false);
			}
		}
	};
	// creating new room

	const creatRoom = async (newRoom) => {
		try {
			const response = await axios.post(
				`${baseUrl}/chat/add-chatroom`,

				{ name: newRoom },
				{
					headers: {
						authorization: `Bearer ${localStorage.getItem("encodedToken")}`,
					},
				}
			);
			toast.success(response.data.message);
			setChatRoom([...chatRoom, response.data.data]);
		} catch (error) {
			toast.error(error.response.data.message);
		}
	};

	// sending message to database
	const sendMessageApi = async (data) => {
		try {
			const response = await axios.post(
				`${baseUrl}/chat/save-message`,
				{ ...data },
				{
					headers: {
						authorization: `Bearer ${localStorage.getItem("encodedToken")}`,
					},
				}
			);

			return response.data.data;
		} catch (error) {
			toast.error(error.response.data.message);
		}
	};

	// deleting message from database
	const deleteMessage = async (messageId) => {
		try {
			const response = await axios.delete(
				`${baseUrl}/chat/delete-message/${messageId}`,

				{
					headers: {
						authorization: `Bearer ${localStorage.getItem("encodedToken")}`,
					},
				}
			);
			if (response.status === 200) {
				toast.success(response.data.message);
				setChatData(chatData.filter((chat) => chat._id !== messageId));
			}
		} catch (error) {
			toast.error(error.response.data.message);
		}
	};

	//editing message api
	const editMessage = async (message, messageId) => {
		try {
			const response = await axios.post(
				`${baseUrl}/chat/update/${messageId}`,
				{ message },
				{
					headers: {
						authorization: `Bearer ${localStorage.getItem("encodedToken")}`,
					},
				}
			);
			setChatData(
				chatData.map((chat) =>
					chat._id === messageId ? response.data.data : chat
				)
			);

			return response.data.data;
		} catch (error) {
			console.log(error);
			toast.error(error.response.data.message);
		}
	};

	// loading profile on first render
	useEffect(() => {
		const token = localStorage.getItem("encodedToken");
		if (token) {
			loadUser();
		} else {
			setIsAuthenticated(false);
		}
	}, [isAuthenticated]);
	return (
		<AuthContext.Provider
			value={{
				login,
				signup,
				isAuthenticated,
				userData,
				logoutHandler,
				chatRoom,
				setChatRoom,
				chatData,
				setChatData,
				sendMessageApi,
				deleteMessage,
				editMessage,
				creatRoom,
				isLoading,
				handleJJoinRoomApi,
				handleLeaveRoomApi,
				showToaster,
				setShowToaster,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
