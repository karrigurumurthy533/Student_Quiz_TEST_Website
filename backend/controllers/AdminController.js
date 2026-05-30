import  User  from "../models/userModel.js";
import handleAsyncError from "../middlewares/handleAsyncError.js";
import HandleError from "../utils/handleError.js";
import crypto from 'crypto';


//Amin -getting ALl User information
export const getUsersList=handleAsyncError(async(req,res,next)=>{
  const users =await User.find();
  res.status(200).json({
    success:true,
    users

  })
})
//ADMIN-Single User Information
export const getSingleUser=handleAsyncError(async(req,res,next)=>{
  const user=await User.findById(req.params.id)
  if(!user){
    return next(new HandleError("User doesn't exist with this id",400))
  }
  res.status(200).json({
    success:true,
    user
  })

})
//Admin -delete user
export const deleteUser=handleAsyncError(async(req,res,next)=>{
  const user=await User.findById(req.params.id);
 
  if(!user){
    return next(new HandleError("User doesn't exist",400))
  }
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success:true,
    message:"User deleted SuccessFully",
    
  })
})







