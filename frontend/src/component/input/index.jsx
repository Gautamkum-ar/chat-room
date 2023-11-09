import React, { useState } from "react";
import { CloseEyeIcon, EyeIcon } from "../icon";

const Input = ({
	label,
	placeholder,
	value,
	onChange,
	className,
	type,
	name,
	...rest
}) => {
	const [isVisible, setIsVisible] = useState(false);

	const handleVisiblity = () => setIsVisible(!isVisible);

	return (
		<label className="flex justify-between relative">
			<input
				type={isVisible ? "text" : type}
				name={name}
				className={` p-1 h-[2.5rem] border rounded-sm w-full focus:outline-none focus:ring-1 ${className} text-[1.1rem] text-[#555]`}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				{...rest}
			/>
			{type === "password" && (
				<p className="flex absolute right-4 top-2 text-2xl text-[#777] justify-center items-center cursor-pointer">
					{!isVisible ? (
						<EyeIcon onClick={handleVisiblity} />
					) : (
						<CloseEyeIcon onClick={handleVisiblity} />
					)}
				</p>
			)}
		</label>
	);
};

export { Input };
