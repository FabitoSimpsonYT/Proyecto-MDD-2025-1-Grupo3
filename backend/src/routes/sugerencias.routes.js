"use strict";

import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { populateUser } from "../middleware/authorization.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";
import { createPublicacion, deletePublicacion, getPublicacion, 
    getPublicacionesPorCategoria, getMisPublicaciones, getPublicacionesPorEstado, 
    getPublicacionPorId, 
    updateEstadoComentario, updatePublicacion } from "../controllers/sugerencias.controller.js";

const router = Router();

router.use(authenticateJwt);

router.get("/", getPublicacion); //listo
router.get("/mis-publicaciones", getMisPublicaciones); //listo
router.get("/:id", getPublicacionPorId); //listo
router.get("/categoria/:categoria", isAdmin, getPublicacionesPorCategoria); 
router.get("/estado/:estado", isAdmin, getPublicacionesPorEstado);       
router.post("/", populateUser, createPublicacion); //listo
router.put("/:id", updatePublicacion); //listo
router.put("/:id/estado", isAdmin, updateEstadoComentario); //listo
router.delete("/:id", populateUser, deletePublicacion);  //listo


export default router;