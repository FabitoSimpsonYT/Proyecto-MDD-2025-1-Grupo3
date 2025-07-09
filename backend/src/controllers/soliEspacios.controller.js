"use strict";
import soliEspacio from "../entity/soliEspaciosComunes.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { createValidation } from "../validations/soliespacios.validation.js";
import { updateValidation } from "../validations/espacios.validation.js";

export async function getAllSoli(req, res) {
    try {
        const soliEspaciosRepository = AppDataSource.getRepository(soliEspacio);
        const getallsoli = await soliEspaciosRepository.find();

        res.status(200).json({ message: "Solicitudes encontradas: ", data: getallsoli})
    } catch (error) {
        console.error("Error al conseguir solicitudes.", error);
        res.status(500).json>({ message: "Error al conseguir solicitudes." });
    }
}

export async function getSoliResidente(req, res){
    try {
        const soliEspaciosRepository = AppDataSource.getRepository(soliEspacio);
        const rutSolicitante = req.user.rut;
        const soliespacio = await soliEspaciosRepository.find({ where: { rutSolicitante } });

        if(!soliespacio) return res.status(404).json({ message: "Solicitud no encontrada"});

        res.status(200).json({ message: "Solicitudes encontradas.", data: solicitudes });
    } catch (error) {
        console.error("Error al conseguir solicitudes del residente.", error);
        res.status(500).json({ message: "Error al conseguir solicitudes del residente." });
    }
}

export async function getOneSoli(req, res){
    try {
        const soliEspaciosRepository = AppDataSource.getRepository(soliEspacio);
        const { id } = req.params
        const soliespacio = await soliEspaciosRepository.findOne({ where: {id} });

        if(!soliespacio) return res.status(404).json({ message: "Solicitud no encontrada"})
        
        res.status(200).json({ message: "Solicitud encontrada: ", data: soliespacio })
    } catch (error) {
        console.error("Error al conseguir solicitud.", error);
        res.status(500).json({ message: "Error al conseguir solicitudes." })
    }
}

export async function getOneSoliUser(req, res){
    try {
        const soliEspaciosRepository = AppDataSource.getRepository(soliEspacio);
        const { id } = req.params;
        const rutSolicitante = req.user.rut;
        const soliespacio = await soliEspaciosRepository.findOne({ where: { id, rutSolicitante } });
        if (!soliespacio) return res.status(404).json({ message: "Solicitud no encontrada o no pertenece al usuario." });
        res.status(200).json({ message: "Solicitud encontrada.", data: soliespacio });
    } catch (error) {
        console.error("Error al conseguir solicitud del usuario.", error);
        res.status(500).json({ message: "Error al conseguir solicitud del usuario." });
    }
}


export async function createSoli(req, res) {
    try {
        const soliEspaciosRepository = AppDataSource.getRepository(soliEspacio);
        const { nombreSolicitante, descripcion, fechaInicio, fechaFin, horaInicio, horaFin } = req.body;
        const idEspacioSol = req.body.idEspacioSol;
        const rutSolicitante = req.user.rut;

        // Validar que el espacio exista
        const espacioRepository = AppDataSource.getRepository("EspacioComun");
        const espacio = await espacioRepository.findOne({ where: { id: idEspacioSol } });
        if (!espacio) {
            return res.status(404).json({ message: "El espacio solicitado no existe." });
        }

        const { error } = createValidation.validate({
            ...req.body,
            idEspacioSol
        });
        if (error) return res.status(400).json({ message: "Error al crear solicitud: ", error: error });

        const newSoli = soliEspaciosRepository.create({
            rutSolicitante,
            nombreSolicitante,
            idEspacioSol,
            descripcion,
            fechaInicio,
            fechaFin,
            horaInicio,
            horaFin
        });

        await soliEspaciosRepository.save(newSoli);

        res.status(201).json({ message: "Solicitud creada exitosamente", data: newSoli });

    } catch (error) {
        console.error("Error al crear solicitud: ", error);
        res.status(500).json({ message: "Error al crear solicitud.", error: error.message })
    }
}

export async function updateSoli(req, res) {
    try {
        const soliEspaciosRepository = AppDataSource.getRepository(soliEspacio);
        const { id } = req.params;
        const { idEspacioSol, descripcion, fechaInicio, fechaFin, horaInicio, horaFin } = req.body;
        const soliespacio = await soliEspaciosRepository.findOne({ where: { id } });

        if (!soliespacio) return res.status(404).json({ message: "Solicitud no encontrada" });
        
        const { error } = updateValidation.validate(req.body);
        if (error) return res.status(400).json({ message: error.message });

        soliespacio.idEspacioSol = idEspacioSol || soliespacio.idEspacioSol;
        soliespacio.descripcion = descripcion || soliespacio.descripcion;
        soliespacio.fechaInicio = fechaInicio || soliespacio.fechaInicio;
        soliespacio.fechaFin = fechaFin || soliespacio.fechaFin;
        soliespacio.horaInicio = horaInicio || soliespacio.horaInicio;
        soliespacio.horaFin = horaFin || soliespacio.horaFin;
        soliespacio.estado = "1";

        await soliEspaciosRepository.save(soliespacio);

        res.status(200).json({ message: "Solicitud actualizada correctamente", data: soliespacio });
    } catch (error) {
        console.error("Error al actualizar solicitud: ", error);
        res.status(500).json({ message: "Error al actualizar solicitud.", error: error.message });
    }
}

export async function updateSoliRes(req, res) {
    try {
        const soliEspaciosRepository = AppDataSource.getRepository(soliEspacio);
        const { id } = req.params;
        const { estado } = req.body;
        const soliespacio = await soliEspaciosRepository.findOne({ where: { id } });

        if (!soliespacio) return res.status(404).json({ message: "Espacio no encontrado." });

        const { error } = updateResValidation.validate(req.body);
        if (error) return res.status(400).json({ message: error.message });

        soliespacio.estado = estado || soliespacio.estado;

        await soliEspaciosRepository.save(soliespacio);

        res.status(200).json({ message: "Solicitud de espacio respondida." });
    } catch (error) {
        console.error("Error al actualizar el estado de la solicitud: ", error);
        res.status(500).json({ message: "Error al actualizar el estado de la solicitud.", error: error.message });
    }
}

export async function deleteSoli(req, res) {
    try {
        const soliEspaciosRepository = AppDataSource.getRepository(soliEspacio);
        const { id } = req.params;
        const soliespacio = await soliEspaciosRepository.findOne({ where: { id } });
        if (!soliespacio) return res.status(404).json({ message: "Solicitud no encontrada." });

        // Autenticación: solo el dueño puede eliminar
        if (soliespacio.rutSolicitante !== req.user.rut) {
            return res.status(403).json({ message: "No tienes permiso para eliminar esta solicitud." });
        }

        await soliEspaciosRepository.remove(soliespacio);
        res.status(200).json({ message: "Solicitud eliminada." });
    } catch (error) {
        console.error("Error al eliminar solicitud: ", error);
        res.status(500).json({ message: "Error al eliminar solicitud." });
    }
}


