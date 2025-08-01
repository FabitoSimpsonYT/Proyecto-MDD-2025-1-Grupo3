"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin, populateUser } from "../middleware/authorization.middleware.js";
import { createSoli, getAllSoli, getOneSoli, updateSoli, updateSoliRes, deleteSoli, getSoliResidente, getOneSoliUser } from "../controllers/soliEspacios.controller.js";


const router = Router();

router.use(authenticateJwt);
router.use(populateUser); 


router.post("/", createSoli);

router.put("/updateRes/:id", isAdmin, updateSoliRes); 
router.put("/:id", updateSoli);
router.delete("/:id", deleteSoli);


router.get("/", isAdmin, getAllSoli);
router.get("/admin/:id", isAdmin, getOneSoli); 


router.get("/residente/:idSolicitud", getOneSoliUser);

router.get("/residente", getSoliResidente);



export default router;
