"use strict";

import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";
import { createPublicacion, deletePublicacion, getPublicacion, 
    getPublicacionesPorCategoria, getPublicacionesPorEmail, getPublicacionesPorEstado, 
    updateEstadoComentario, updatePublicacion } from "../controllers/sugerencias.controller.js";

const router = Router();

router.use(authenticateJwt);

router.get("/", getPublicacion);
router.get("/autor/:email",isAdmin, getPublicacionesPorEmail);
router.get("/categoria/:categoria", isAdmin, getPublicacionesPorCategoria); 
router.get("/estado/:estado", isAdmin, getPublicacionesPorEstado);       
router.post("/",createPublicacion);
router.put("/:id", updatePublicacion);
router.put("/:id/estado", isAdmin, updateEstadoComentario);
router.delete("/:id", isAdmin, deletePublicacion); 


export default router;