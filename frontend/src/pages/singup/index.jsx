import { useState } from "react";
import { Input } from "../../component";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/auth-context";

export const SignUp = () => {
	const { signup } = useAuth();
	const [signupData, setSignupData] = useState({
		username: "",
		email: "",
		password: "",
	});

	return (
		<div className="flex justify-center items-center">
			<form
				className="flex flex-col justify-center items-center gap-3 p-4 shadow-2xl rounded-md mt-8 w-80"
				onSubmit={(e) => e.preventDefault()}>
				<h1>Singup</h1>
				<Input
					className="p-1 rounded-sm px-2"
					placeholder="User Name"
					type="text"
					onChange={(e) =>
						setSignupData({ ...signupData, username: e.target.value })
					}
				/>
				<Input
					className="p-1 rounded-sm px-2"
					type={"email"}
					placeholder="Email"
					onChange={(e) =>
						setSignupData({ ...signupData, email: e.target.value })
					}
				/>
				<Input
					className="p-1 rounded-sm px-2"
					type={"password"}
					placeholder="password"
					onChange={(e) =>
						setSignupData({ ...signupData, password: e.target.value })
					}
				/>
				<button
					className="flex justify-center items-center bg-green-500 p-1 px-5 rounded text-white w-full"
					onClick={() => signup(signupData)}>
					Join
				</button>
				<p>
					Already have account?? <Link to={"/login"}>Login</Link>
				</p>
			</form>
		</div>
	);
};
