import express from "express";
import {
    createTest,
    getAllTests,
    getSingleTest,
    deleteTest,
    submitTest,
} from "../controllers/testController.js";
import { verifyUserAuth, roleBasedAccess } from "../middlewares/userAuth.js";

const router = express.Router();

router.post("/admin/test/create", verifyUserAuth, roleBasedAccess("admin"), createTest);
router.get("/tests",verifyUserAuth,getAllTests);
router.get("/test/:id",verifyUserAuth, getSingleTest);
router.delete("/admin/test/:id",verifyUserAuth, roleBasedAccess("admin"),deleteTest);
router.post("/test/:id/submit",verifyUserAuth, submitTest);


export default router;