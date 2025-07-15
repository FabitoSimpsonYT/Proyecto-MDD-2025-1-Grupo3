import { Router } from "express";
import multer from "multer";
import {
  registrarPago,
  obtenerPagos,
  confirmarPagoAdmin,
} from "../controllers/pagos.controller.js";
import { isAdmin } from "../middleware/authorization.middleware.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("voucher"), registrarPago);


router.get("/", authenticateJwt, isAdmin, obtenerPagos);
router.put("/:id/confirmar", authenticateJwt, isAdmin, confirmarPagoAdmin);

export default router;
