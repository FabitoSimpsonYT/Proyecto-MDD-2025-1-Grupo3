"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";
import { createSoli, getAllSoli, getOneSoli, updateSoli, updateSoliRes, deleteSoli, getSoliResidente } from "../controllers/soliEspacios.controller.js";


const router = Router();

router.use(authenticateJwt);

router.get("/", isAdmin, getAllSoli);
router.get("/:rutSolicitante", getSoliResidente);
router.get("/:id", isAdmin, getOneSoli);
router.get("/:rutSolicitante/:id", isAdmin, getOneSoli);

router.post("/", createSoli);

router.put("/:id", updateSoli);
router.put("/updateRes/:id", isAdmin, updateSoliRes);

router.delete("/:id", deleteSoli);




export default router;
