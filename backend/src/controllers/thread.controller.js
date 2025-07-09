"use strict";

import { AppDataSource } from "../config/configDb.js";
import { ThreadEntity } from "../entity/thread.entity.js";
import { threadValidation } from "../validations/thread.validation.js";

export const createThread = async (req, res) => {
    try {
        const { titulo, tipo, soloLectura } = req.body;
        const user = req.user;
        const { error } = threadValidation.validate(req.body);
        if (error) return res.status(400).json({ message: "Error de validación" });

        let isSoloLectura = false;
        if (soloLectura){
            if (user.role !== "administrador") {
                return res.status(403).json({ message: "Solo los administradores pueden crear hilos de solo lectura." });
            }
            isSoloLectura = true;
        }
        const threadRepo = AppDataSource.getRepository(ThreadEntity);
        const newThread = threadRepo.create({
            titulo,
            tipo,
            soloLectura: isSoloLectura,
            creadoPor: user.id
        });
        await threadRepo.save(newThread);
        res.status(201).json(newThread)
    } catch (error) {
       res.status(500).json({ message: "Error al crear el hilo.", error: error.message });
    }

};

export const getThreads = async (req, res) => {
    try {
        const threadRepo = AppDataSource.getRepository(ThreadEntity);
        const threads = await threadRepo.find();
        if (!threads || threads.length === 0) {
            return res.status(404).json({ message: "No se encontraron hilos." });
        }
        res.json(threads);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los hilos." });
    }
}

export const updateThread = async (req, res) => {
    try {
        const {id} = req.params;
        const { titulo, tipo, soloLectura } = req.body;
        const user = req.user;
        const { error } = threadValidation.validate(req.body);
        if (error) return res.status(400).json({ message: "Error de validación" });


        const threadRepo = AppDataSource.getRepository(ThreadEntity);
        const thread = await threadRepo.findOneBy({ id: Number(id) });

        if (!thread) {
            return res.status(404).json({ message: "Hilo no encontrado." });
        }

        if (thread.soloLectura && user.role !== "administrador") {
            return res.status(403).json({ message: "No tienes permiso para editar un hilo de solo lectura." });
        }
         if (soloLectura !== undefined) {
            if (user.role !== "administrador") {
                return res.status(403).json({ message: "Solo el administrador puede cambiar soloLectura." });
            }
            thread.soloLectura = soloLectura;
        }
    if (titulo !== undefined) thread.titulo = titulo;
    if ( tipo !== undefined) thread.tipo = tipo;

    await threadRepo.save(thread);
    res.json({ message: "Hilo actualizado correctamente.", thread });
    
    }catch (error) {
        res.status(500).json({ message: "Error al actualizar el hilo.", error: error.message });
    }
}
