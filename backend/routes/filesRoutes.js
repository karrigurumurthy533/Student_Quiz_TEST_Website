import express from "express";
import upload from "../config/multer.js";
import {
  uploadFile,
  getAllFiles,
  getSingleFile,
  deleteFile,
} from "../controllers/fileController.js";
import {
  verifyUserAuth,
  roleBasedAccess,
} from "../middlewares/userAuth.js";

const router = express.Router();

// Upload PDF (Admin Only)
router.post(
  "/admin/file/upload",
  verifyUserAuth,
  roleBasedAccess("admin"),
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  uploadFile
);

// Get All Files
router.get(
  "/files",
  verifyUserAuth,
  getAllFiles
);

// Get Single File
router.get(
  "/file/:id",
  verifyUserAuth,
  getSingleFile
);

// Delete File (Admin Only)
router.delete(
  "/admin/file/:id",
  verifyUserAuth,
  roleBasedAccess("admin"),
  deleteFile
);

export default router;