"use strict";
import { AppDataSource } from "../config/configDb.js";
import { CommentEntity } from "../entity/comment.entity.js";
import { commentValidation } from "../validations/comment.validation.js";

export const createComment = async (req, res) => {
    try {
        const { contenido, threadId } = req.body;
        const user = req.user;
        const { error } = commentValidation.validate(req.body);
        if (error) return res.status(400).json({ message: error.message });

        if (!contenido || !threadId) {
            return res.status(400).json({ message: "Contenido y hiloId son requeridos." });
        }

        const commentRepo = AppDataSource.getRepository(CommentEntity);
        const newComment = commentRepo.create({
            contenido,
            threadId,
            creadoPor: user.id
        });

        await commentRepo.save(newComment);
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el comentario.", error: error.message });
    }
};

export const getCommentsByThread = async (req, res) => {
    try {
        const { threadId } = req.params;

        if (!threadId) {
            return res.status(400).json({ message: "hiloId es requerido." });
        }

        const commentRepo = AppDataSource.getRepository(CommentEntity);
        const comments = await commentRepo.find({
            where: { threadId },
            relations: ["user"]
        });

        if (!comments || comments.length === 0) {
            return res.status(404).json({ message: "No se encontraron comentarios para este hilo." });
        }

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los comentarios.", error: error.message });
    }
};

export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { contenido } = req.body;
        const user = req.user;

        if (!contenido) {
            return res.status(400).json({ message: "Contenido es requerido." });
        }

        const commentRepo = AppDataSource.getRepository(CommentEntity);
        const comment = await commentRepo.findOne({ where: { id, creadoPor: user.id } });

        if (!comment) {
            return res.status(404).json({ message: "Comentario no encontrado o no autorizado para editar." });
        }

        comment.contenido = contenido;
        await commentRepo.save(comment);

        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el comentario.", error: error.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const commentRepo = AppDataSource.getRepository(CommentEntity);
        const comment = await commentRepo.findOne({ where: { id, creadoPor: user.id } });

        if (!comment) {
            return res.status(404).json({ message: "Comentario no encontrado o no autorizado para eliminar." });
        }

        await commentRepo.remove(comment);
        res.json({ message: "Comentario eliminado exitosamente." });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el comentario.", error: error.message });
    }
}