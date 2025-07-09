import { Router } from "express";
import { createAttendance, getAttendanceByThread } from "../controllers/attendance.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";

const router = Router();

router.use(authenticateJwt);

router.post("/create", createAttendance);
router.get("/:threadId", getAttendanceByThread);

export default router;