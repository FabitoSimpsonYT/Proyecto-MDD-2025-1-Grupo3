"use strict"
import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin, } from "../middleware/authorization.middleware.js";
import{getvisitantes,createvisitante, deletevisitante, getvisitanteId, updatevisitante} from "../controllers/visitante.controller.js";

const router = Router ();

router.use(authenticateJwt);

router.get("/",isAdmin,getvisitantes);
router.delete("/:id",isAdmin,deletevisitante)
router.put("/:id",isAdmin,updatevisitante);

router.post("/",createvisitante);

router.get("/:id",getvisitanteId);
 
export default router ;
