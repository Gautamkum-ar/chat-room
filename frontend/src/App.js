import { Route, Routes } from "react-router-dom";
import { Home, Login, SignUp } from "./pages";
import { GuestRoutes, ProtectedRoutes } from "./routes/route";
import { useAuth } from "./context/auth-context";
import { Loader, Toaster } from "./component";

function App() {
	const { isLoading } = useAuth();
	return (
		<div className=" flex justify-center flex-col w-full h-screen items-center bg-slate-200 p-4 gap-4">
			<Toaster />
			{isLoading ? (
				<Loader />
			) : (
				<Routes>
					<Route element={<ProtectedRoutes />}>
						<Route path="/" element={<Home />} />
					</Route>
					<Route element={<GuestRoutes />}>
						<Route path="/signup" element={<SignUp />} />
						<Route path="/login" element={<Login />} />
					</Route>
				</Routes>
			)}
		</div>
	);
}

export default App;
