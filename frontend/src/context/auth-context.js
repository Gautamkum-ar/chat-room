import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
	const [flag, setFlag] = useState(true);
	const [userData, setUserData] = useState({});
	const [chatRoom, setChatRoom] = useState([]);
	const [chatData, setChatData] = useState([]);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const navigate = useNavigate();

	// login user in app
	const login = async (loginData) => {
		try {
			const response = await axios.post(
				"http://localhost:3005/v1/api/auth/login",
				{ ...loginData }
			);
			if (response.status === 200) {
				setIsAuthenticated(true);
				localStorage.setItem("encodedToken", response.data.data.encodedToken);
			}
		} catch (error) {
			console.log(error);
		}
	};

	// logout
	const logoutHandler = () => {
		setIsAuthenticated(false);
		localStorage.removeItem("encodedToken");
	};

	// registering new user
	const signup = async (signupData) => {
		try {
			const response = await axios.post(
				"http://localhost:3005/v1/api/auth/signup",
				{
					...signupData,
				}
			);
			if (response.status === 201) {
				alert("Successfully signed up!");
				navigate("/login");
			}
		} catch (error) {
			console.log(error);
		}
	};

	// loading profile of user

	const loadUser = async () => {
		const token = localStorage.getItem("encodedToken");
		if (flag) {
			setFlag(false);
			try {
				const response = await axios.get(
					"http://localhost:3005/v1/api/auth/get-user",
					{
						headers: {
							authorization: `Bearer ${token}`,
						},
					}
				);
				if (response) {
					setUserData(response?.data?.data?.findUser);
					setChatRoom(response?.data?.data?.chatroom);
					setChatData(response?.data?.data?.chats);
					setIsAuthenticated(true);
				}
			} catch (error) {
				console.log(error);
			}
		}
	};
	// creating new room

	const creatRoom = async (newRoom) => {
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

	// sending message to database
	const sendMessageApi = async (data) => {
		try {
			const response = await axios.post(
				"http://localhost:3005/v1/api/chat/save-message",
				{ ...data },
				{
					headers: {
						authorization: `Bearer ${localStorage.getItem("encodedToken")}`,
					},
				}
			);

			return response.data.data;
		} catch (error) {
			console.log(error);
		}
	};

	// deleting message from database
	const deleteMessage = async (messageId) => {
		try {
			const response = await axios.delete(
				`http://localhost:3005/v1/api/chat/delete-message/${messageId}`,

				{
					headers: {
						authorization: `Bearer ${localStorage.getItem("encodedToken")}`,
					},
				}
			);
			if (response.status === 200) {
				setChatData(chatData.filter((chat) => chat._id !== messageId));
			}
		} catch (error) {
			console.log(error);
		}
	};

	//editing message api
	const editMessage = async (message, messageId) => {
		try {
			const response = await axios.post(
				`http://localhost:3005/v1/api/chat/update/${messageId}`,
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
			}}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
