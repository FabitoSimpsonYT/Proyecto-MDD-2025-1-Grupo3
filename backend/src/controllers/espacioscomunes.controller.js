"use strict";
import EspacioComun from "../entity/espacioscomunes.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { createValidation, updateValidation } from "../validations/espacios.validation.js";

export async function getEspacios(req, res) {
    try {
        const espacioscomunesRepository = AppDataSource.getRepository(EspacioComun);
        const espacios = await espacioscomunesRepository.find();

        res.status(200).json({ message: "Espacios encontrados: ", data: espacios })
    } catch (error) {
        console.error("Error en espacioscomunes.controller.js -> getUsers(): ", error);
        res.status(500).json({ message: "Error interno del servidor." })
    }
}

export async function getEspacioById(req, res) {
    try {
        const espacioscomunesRepository = AppDataSource.getRepository(EspacioComun);
        const { id } = req.params
        const espaciocomun = await espacioscomunesRepository.findOne({ where: {id} });

        if(!espaciocomun) return res.status(404).json({ message: "Espacio no encontrado "});

        res.status(200).json({ message: "Espacio encontrado: ", data: espaciocomun })
    } catch (error) {
        console.error("Error al conseguir espacio", error);
        res.status(500).json({ message: "Error al conseguir espacio." })
    }
}

export async function createEspacios(req, res){
    try {
        const espacioscomunesRepository = AppDataSource.getRepository(EspacioComun);
        const { nombreEspacio, direccionEspacio } = req.body;
        const { error } = createValidation.validate(req.body);
        if (error) return res.status(400).json({ message: "Error al crear espacio: ", error: error});
        
        const newEspacio = espacioscomunesRepository.create({
            nombreEspacio,
            direccionEspacio,
        });

        await espacioscomunesRepository.save(newEspacio);

        res.status(201).json({
            message: "Espacio creado exitosamente",
            data: newEspacio,
        })
    } catch (error) {
        console.error("Error al crear espacio: ", error);
        res.status(500).json({message: "Error al crear espacio común."})
    }
}

export async function updateEspacio(req, res) {
    try {
        const espacioscomunesRepository = AppDataSource.getRepository(EspacioComun);
        const { id } = req.params;
        const { nombreEspacio, direccionEspacio } = req.body;
        const espaciocomun = await espacioscomunesRepository.findOne({ where: { id } })

        if (!espaciocomun) return res.status(404).json({ message: "Espacio no encontrado."});

        const { error } = updateValidation.validate(req.body);
        if (error) return res.status(400).json({ message: error.message })

        espaciocomun.nombreEspacio = nombreEspacio || espaciocomun.nombreEspacio
        espaciocomun.direccionEspacio = direccionEspacio || espaciocomun.direccionEspacio

        await espacioscomunesRepository.save(espaciocomun);

        res.status(200).json({ message: "Espacio actualizado correctamente: ", data: espaciocomun})
    } catch (error) {
        console.error("Error al actualizar espacio: ", error);
        res.status(500).json({message: "Error al actualizar espacio común."})
    }
}

export async function deleteEspacio(req, res) {
    try {
        const espacioscomunesRepository = AppDataSource.getRepository(EspacioComun);
        const { id } = req.params;
        const espaciocomun = await espacioscomunesRepository.findOne({ where: { id } });
        if (!espaciocomun) return res.status(404).json({ message: "Espacio no encontrado" });

        await espacioscomunesRepository.remove(espaciocomun);

        res.status(200).json({ message: "Espacio común eliminado exitosamente" });

    } catch (error) {
        console.error("Error al eliminar espacio: ", error);
        res.status(500).json({message: "Error al crear espacio común."})
    }
}


