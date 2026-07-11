import handleAsyncError from "../middlewares/handleAsyncError.js";
import User from "../models/userModel.js";
import HandleError from "../utils/handleError.js";
import jwt from "jsonwebtoken";

export const verifyUserAuth = handleAsyncError(async (req, res, next) => {
  let token = req.cookies?.token;

  // Authorization header support
  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new HandleError("Authentication missing! Please login", 401)
    );
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const user = await User.findById(decodedData.id);

  if (!user) {
    return next(new HandleError("User not found", 404));
  }

  req.user = user;
  next();
});

// 🔐 Role-based access
export const roleBasedAccess = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new HandleError(
          `Role-${req.user.role} not allowed to access`,
          403
        )
      );
    }
    next();
  };
};