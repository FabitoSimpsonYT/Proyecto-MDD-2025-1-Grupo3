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


// Registrar pago (usuario autenticado)
router.post("/", authenticateJwt, upload.single("voucher"), registrarPago);



// Listar todos los pagos (solo admin)
router.get("/", authenticateJwt, isAdmin, obtenerPagos);

// Historial de pagos del usuario autenticado
router.get("/historial", authenticateJwt, obtenerHistorialPagosUsuario);

// Historial de pagos por cuenta (solo admin)
router.get("/historial/:cuentaId", authenticateJwt, isAdmin, obtenerHistorialPagosPorCuenta);

router.put("/:id/confirmar", authenticateJwt, isAdmin, confirmarPagoAdmin);
router.put("/:id/rechazar", authenticateJwt, isAdmin, rechazarPagoAdmin);

export default router;
