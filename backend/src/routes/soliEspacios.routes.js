"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";
import { createSoli, getAllSoli, getOneSoli, updateSoli, updateSoliRes, deleteSoli, getSoliResidente, getOneSoliUser } from "../controllers/soliEspacios.controller.js";


const router = Router();

router.use(authenticateJwt);

// Rutas de modificación primero para evitar conflictos de enrutamiento
router.post("/", createSoli);

router.put("/updateRes/:id", isAdmin, updateSoliRes); // <-- Mover antes de la genérica
router.put("/:id", updateSoli);
router.delete("/:id", deleteSoli);

// Rutas de consulta
router.get("/", isAdmin, getAllSoli);
router.get("/admin/:id", isAdmin, getOneSoli); // Solo admin puede ver por id
router.get("/residente/:rutSolicitante", getSoliResidente); // Solicitudes por rut
router.get("/residente/:rutSolicitante/:id", getOneSoliUser);


router.put("/updateRes/:id", isAdmin, updateSoliRes);






export default router;
