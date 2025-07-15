"use strict"
import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin, } from "../middleware/authorization.middleware.js";
import{getvisitantes,createvisitante, deletevisitante, getvisitanteId, updatevisitante} from "../controllers/visitante.controller.js";

const router = Router ();

router.use(authenticateJwt);
//get visitantes y get visitantes id de las ruta 
router.get("/",isAdmin,getvisitantes);
router.get("/:id",getvisitanteId);
//post de la createvisitante de la ruta
router.post("/",createvisitante);
// out de updatevisitante y deletevisitante de las ruta
router.put("/:id",isAdmin,updatevisitante);
router.delete("/:id",isAdmin,deletevisitante)
 
export default router ;
