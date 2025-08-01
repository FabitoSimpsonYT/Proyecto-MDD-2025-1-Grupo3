import { Router } from "express";
import multer from "multer";
import {
  registrarPago,
  obtenerPagos,
  confirmarPagoAdmin,
  obtenerHistorialPagosPorCuenta,
  obtenerHistorialPagosUsuario,
  rechazarPagoAdmin,
} from "../controllers/pagos.controller.js";
import { isAdmin } from "../middleware/authorization.middleware.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";

const router = Router();
const upload = multer({ dest: "uploads/" });



router.post("/", authenticateJwt, upload.single("voucher"), registrarPago);




router.get("/", authenticateJwt, isAdmin, obtenerPagos);


router.get("/historial", authenticateJwt, obtenerHistorialPagosUsuario);


router.get("/historial/:cuentaId", authenticateJwt, isAdmin, obtenerHistorialPagosPorCuenta);

router.put("/:id/confirmar", authenticateJwt, isAdmin, confirmarPagoAdmin);
router.put("/:id/rechazar", authenticateJwt, isAdmin, rechazarPagoAdmin);

export default router;
