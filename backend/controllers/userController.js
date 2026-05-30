import  User  from "../models/userModel.js";
import handleAsyncError from "../middlewares/handleAsyncError.js";
import HandleError from "../utils/handleError.js";
import { sendToken } from "../utils/jwtToken.js";
import crypto from 'crypto';


export const registerUser = handleAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "temp",
      url: "temp",
    },
  });

  if (!user) {
    return res.status(500).json({
      success: false,
      message: "User creation failed",
    });
  }

  sendToken(user, 201, res, "Registered Successfully");
});
//2️⃣Login User Functionality
export const loginUser = handleAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new HandleError("Email or password cannot be empty", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new HandleError("Invalid Email or Password", 401));
  }

  // ✅ Compare password
  const isPasswordMatched = await user.verifyPassword(password);

  if (!isPasswordMatched) {
    return next(new HandleError("Invalid Email or Password", 401));
  }

  // ✅ Send token only if password matches
  sendToken(user, 200, res,"Login SuccessFully");
});
//3️⃣LogOut Functionality
export const logout = handleAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
})
//8️⃣Updating user profile
export const updateProfile=handleAsyncError(async(req,res,next)=>{
  const {name,email}=req.body;
   const updateUserDetails={
    name,
    email
   }
   const user=await User.findById(req.params.id,
   updateUserDetails,{
    new:true,
    runValidators:true
   });
   sendToken(user,200,res,"Profile Updated SuccessFully");
   
})














