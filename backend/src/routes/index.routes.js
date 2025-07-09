"use strict";
import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import espaciosComunesRoutes from "./espacioscomunes.routes.js";
import soliEspaciosRoutes from "./soliEspacios.routes.js";
import threadRoutes from "./thread.routes.js";
import commentRoutes from "./comment.routes.js";
import attendanceRoutes from "./attendance.routes.js";

const router = new Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/espaciosComunes", espaciosComunesRoutes);
router.use("/soliEspacios", soliEspaciosRoutes);
router.use("/threads", threadRoutes);
router.use("/comments", commentRoutes);
router.use("/attendance", attendanceRoutes);


export default router;