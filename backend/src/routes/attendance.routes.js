import { Router } from "express";
import { createAttendance, getAttendanceByThread } from "../controllers/attendance.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";
import { populateUser } from "../middleware/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);

router.post("/create", populateUser, createAttendance);
router.get("/:threadId", isAdmin, getAttendanceByThread);

export default router;