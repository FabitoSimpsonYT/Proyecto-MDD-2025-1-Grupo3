import { Router } from "express";
import {
  registrarUsuario,
  listarUsuarios,
  modificarUsuario,
  eliminarCuenta,
  restarSaldo,
} from "../controllers/cuentas.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();


router.post("/", registrarUsuario);

router.get("/", listarUsuarios);


router.put("/:id", authenticateJwt, isAdmin, modificarUsuario);


router.delete("/:id", authenticateJwt, isAdmin, eliminarCuenta);


router.put("/:id/restar-saldo", authenticateJwt, isAdmin, restarSaldo);

export default router;
