import express from "express";
import { registerUser,loginUser,logout} from "../controllers/userController.js";
import { getUsersList, getSingleUser,deleteUser} from "../controllers/AdminController.js";
import {verifyUserAuth,roleBasedAccess} from '../middlewares/userAuth.js';

const router = express.Router();

// 🔓 Public Routes
router.route("/register").post(registerUser);

// Authentication Routes
router.route("/login").post(loginUser);
router.route("/logout").post(logout);


//Admin Routes
router.route("/admin/users").get(verifyUserAuth,roleBasedAccess("admin"),getUsersList);
router.route("/admin/user/:id").get(verifyUserAuth,roleBasedAccess("admin"),getSingleUser);
router.route("/admin/user/:id").delete(verifyUserAuth,roleBasedAccess("admin"),deleteUser);


export default router;