import { useState } from "react";
import { Input } from "../../component";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth-context";

export const Login = () => {
	const { login } = useAuth();
	const [loginData, setLoginData] = useState({
		email: "",
		password: "",
	});

	return (
		<div className="flex justify-center items-center">
			<form
				className="flex flex-col justify-center items-center gap-3 p-4 shadow-2xl rounded-md mt-8 w-80"
				onSubmit={(e) => e.preventDefault()}>
				<h1 className="flex font-bold text-blue-600">Login</h1>

				<Input
					className="p-1 rounded-sm px-2"
					type={"email"}
					placeholder="Email"
					onChange={(e) =>
						setLoginData({ ...loginData, email: e.target.value })
					}
				/>
				<Input
					className="p-1 rounded-sm px-2"
					type={"password"}
					placeholder="Password"
					onChange={(e) =>
						setLoginData({ ...loginData, password: e.target.value })
					}
				/>
				<button
					className="flex justify-center items-center bg-green-500 p-1 px-5 rounded text-white w-28"
					onClick={() => login(loginData)}>
					Join
				</button>
				<p className="flex text-sm gap-2">
					Not have account?{" "}
					<Link className="flex text-blue-500 " to={"/signup"}>
						Signup
					</Link>
				</p>
			</form>
		</div>
	);
};
