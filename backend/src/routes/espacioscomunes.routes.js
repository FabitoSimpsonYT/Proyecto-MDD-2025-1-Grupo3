"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";
import { getEspacios, createEspacios, getEspacioById, updateEspacio, deleteEspacio } from "../controllers/espacioscomunes.controller.js";

const router = Router();

router.use(authenticateJwt);

router.get("/", getEspacios);
router.get("/:id", getEspacioById);

router.post("/", isAdmin, createEspacios);
router.put("/:id", isAdmin, updateEspacio);
router.delete("/:id", isAdmin, deleteEspacio);

export default router;