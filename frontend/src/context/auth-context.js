import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
	const [flag, setFlag] = useState(true);
	const [userData, setUserData] = useState({});
	const [chatRoom, setChatRoom] = useState([]);
	const [chatData, setChatData] = useState([]);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

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
			}
		} catch (error) {
			console.log(error);
		}
	};

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
	const logoutHandler = () => {
		setIsAuthenticated(false);
		localStorage.removeItem("encodedToken");
	};

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
			}}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
