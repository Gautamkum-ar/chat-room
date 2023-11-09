import jwt from "jsonwebtoken";

export const checkAuth = async (req, res, next) => {
	//checking for token
	if (!req.headers.authorization) {
		return res.status(401).json({
			success: false,
			message: "No token provided",
		});
	}

	// checking for token
	const token = req.headers.authorization.split(" ")[1];
	if (!token) {
		return res.status(401).json({
			success: false,
			message: "No token provided",
		});
	}

	try {
		//decoding token
		const decoded = await jwt.verify(token, process.env.JWT_SECERT);
		req.user = decoded;
		next();
	} catch (error) {
		return res.status(401).json({
			success: false,
			message: "Invalid token",
		});
	}
};
