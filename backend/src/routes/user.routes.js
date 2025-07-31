"use strict";
import { Router } from "express";
import { getUsers, getUserById, getProfile, updateUserById, deleteUserById, getPublicUsers, changeUserRole } from "../controllers/user.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();


// Ruta pública para obtener información limitada de usuarios
router.get("/public", getPublicUsers);

// Middleware para autenticar el JWT
router.use(authenticateJwt);

// Rutas públicas
router.get("/profile", getProfile);

// Middleware para verificar si el usuario es administrador
router.use(isAdmin);

// Ruta para cambiar el rol de un usuario
router.put("/:userId/role", changeUserRole);

// Rutas para obtener usuarios
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUserById);
router.delete("/:id", deleteUserById);

export default router;