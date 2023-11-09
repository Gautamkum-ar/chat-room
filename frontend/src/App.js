import { Route, Routes } from "react-router-dom";
import { Home, Login, SignUp } from "./pages";
import { GuestRoutes, ProtectedRoutes } from "./routes/route";

function App() {
	return (
		<div className=" fl ex flex-col w-full h-screen items-center bg-slate-200 p-4 gap-4">
			<Routes>
				<Route element={<ProtectedRoutes />}>
					<Route path="/" element={<Home />} />
				</Route>
				<Route element={<GuestRoutes />}>
					<Route path="/signup" element={<SignUp />} />
					<Route path="/login" element={<Login />} />
				</Route>
			</Routes>
		</div>
	);
}

export default App;
