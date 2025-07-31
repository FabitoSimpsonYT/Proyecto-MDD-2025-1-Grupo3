"use strict";

import { Router } from "express";
import { AppDataSource } from "../config/configDb.js";
import User from "../entity/user.entity.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

// Ruta para hacer admin a un usuario (solo accesible por otros admins)
router.put("/make-admin/:userId", authenticateJwt, isAdmin, async (req, res) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const { userId } = req.params;

        // Buscar el usuario
        const user = await userRepository.findOne({ where: { id: parseInt(userId) } });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Actualizar el rol a administrador
        user.role = "administrador";
        await userRepository.save(user);

        res.json({ 
            message: "Usuario actualizado a administrador exitosamente",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Error al hacer admin al usuario:", error);
        res.status(500).json({ message: "Error al actualizar el rol del usuario" });
    }
});

export default router;
