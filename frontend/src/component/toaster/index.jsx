import React from "react";
import { useAuth } from "../../context/auth-context";
import "../toaster/style.css";

const Toaster = () => {
	const { setShowToaster, showToaster } = useAuth();

	return (
		<div
			className="toast__container"
			style={{
				display: showToaster.status ? "flex" : "none",
				color: showToaster.color,
			}}>
			<div className="toast">
				{showToaster.message}
				<button
					className="clz__btn"
					onClick={() =>
						setShowToaster({
							...showToaster,
							status: false,
						})
					}>
					X
				</button>
			</div>
			<span style={{ background: showToaster.color }}></span>
		</div>
	);
};

export { Toaster };
