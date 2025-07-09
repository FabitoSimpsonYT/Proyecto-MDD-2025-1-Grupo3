"use strict";
import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import espaciosComunesRoutes from "./espacioscomunes.routes.js";
import soliEspaciosRoutes from "./soliEspacios.routes.js";

const router = new Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/espaciosComunes", espaciosComunesRoutes);
router.use("/soliEspacios", soliEspaciosRoutes);


export default router;