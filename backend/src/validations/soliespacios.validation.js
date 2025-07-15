"use strict";
import Joi from "joi";

export const createValidation = Joi.object({
    idEspacioSol: Joi.number()
        .required()
        .messages({
            "number.base": "El ID del espacio solicitado debe ser un número",
            "number.empty": "El ID del espacio solicitado no puede estar vacío",
        }),
    descripcion: Joi.string()
        .required()
        .min(50)
        .max(1000)
        .messages({
            "string.empty": "La descripción no puede estar vacía",
            "string.min": "La descripción debe tener al menos 50 caracteres",
            "string.max": "La descripción no puede exceder los 1000 caracteres",
        }),
    fechaInicio: Joi.date()
        .required()
        .messages({
            "date.base": "La fecha de inicio debe ser una fecha válida",
            "date.empty": "La fecha de inicio no puede estar vacía",
        }),
    fechaFin: Joi.date()
        .required()
        .messages({
            "date.base": "La fecha de fin debe ser una fecha válida",
            "date.empty": "La fecha de fin no puede estar vacía",
        }),
    horaInicio: Joi.string()
        .required()
        .pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
        .messages({
            "string.empty": "La hora de inicio no puede estar vacía",
            "string.base": "La hora de inicio debe ser de tipo string",
            "string.pattern.base": "La hora de inicio debe tener el formato HH:MM (24 horas)",
        }),
    horaFin: Joi.string()
        .required()
        .pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
        .messages({
            "string.empty": "La hora de fin no puede estar vacía",
            "string.base": "La hora de fin debe ser de tipo string",
            "string.pattern.base": "La hora de fin debe tener el formato HH:MM (24 horas)",
        }),
}).unknown(true).custom((value, helpers) => {
    if (value.fechaFin < value.fechaInicio) {
        return helpers.message("La fecha de fin debe ser mayor o igual a la fecha de inicio");
    }
    if (
        value.fechaFin && value.fechaInicio &&
        value.fechaFin.getTime && value.fechaInicio.getTime &&
        value.fechaFin.getTime() === value.fechaInicio.getTime() &&
        typeof value.horaInicio === "string" &&
        typeof value.horaFin === "string"
    ) {
        const [hInicio, mInicio] = value.horaInicio.split(":").map(Number);
        const [hFin, mFin] = value.horaFin.split(":").map(Number);
        const minutosInicio = hInicio * 60 + mInicio;
        const minutosFin = hFin * 60 + mFin;
        if (minutosFin < minutosInicio) {
            return helpers.message("La hora de fin no puede ser menor a la hora de inicio si las fechas son iguales");
        }
    }
    return value;
}).unknown(false).messages({
    "object.unknown": "No se permiten campos adicionales."
});



export const updateValidation = Joi.object({
    idEspacioSol: Joi.number()
        .required()
        .messages({
            "number.base": "El ID del espacio solicitado debe ser un número",
            "number.empty": "El ID del espacio solicitado no puede estar vacío",
        }),
    descripcion: Joi.string()
        .required()
        .min(50)
        .max(1000)
        .messages({
            "string.empty": "La descripción no puede estar vacía",
            "string.min": "La descripción debe tener al menos 50 caracteres",
            "string.max": "La descripción no puede exceder los 1000 caracteres",
        }),
    fechaInicio: Joi.date()
        .required()
        .messages({
            "date.base": "La fecha de inicio debe ser una fecha válida",
            "date.empty": "La fecha de inicio no puede estar vacía",
        }),
    fechaFin: Joi.date()
        .required()
        .messages({
            "date.base": "La fecha de fin debe ser una fecha válida",
            "date.empty": "La fecha de fin no puede estar vacía",
        }),
    horaInicio: Joi.string()
        .required()
        .pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
        .messages({
            "string.empty": "La hora de inicio no puede estar vacía",
            "string.base": "La hora de inicio debe ser de tipo string",
            "string.pattern.base": "La hora de inicio debe tener el formato HH:MM (24 horas)",
        }),
    horaFin: Joi.string()
        .required()
        .pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
        .messages({
            "string.empty": "La hora de fin no puede estar vacía",
            "string.base": "La hora de fin debe ser de tipo string",
            "string.pattern.base": "La hora de fin debe tener el formato HH:MM (24 horas)",
        }),
}).custom((value, helpers) => {
    if (value.fechaFin < value.fechaInicio) {
        return helpers.message("La fecha de fin debe ser mayor o igual a la fecha de inicio");
    }
    if (
        value.fechaFin && value.fechaInicio &&
        value.fechaFin.getTime && value.fechaInicio.getTime &&
        value.fechaFin.getTime() === value.fechaInicio.getTime() &&
        typeof value.horaInicio === "string" &&
        typeof value.horaFin === "string"
    ) {
        const [hInicio, mInicio] = value.horaInicio.split(":").map(Number);
        const [hFin, mFin] = value.horaFin.split(":").map(Number);
        const minutosInicio = hInicio * 60 + mInicio;
        const minutosFin = hFin * 60 + mFin;
        if (minutosFin < minutosInicio) {
            return helpers.message("La hora de fin no puede ser menor a la hora de inicio si las fechas son iguales");
        }
    }
    return value;
}).messages({
    "object.unknown": "No se permiten campos adicionales, excepto 'nombreSolicitante' (que será ignorado si se envía)."
});



export const updateResValidation = Joi.object({
    estado: Joi.string()
        .valid("2", "3")
        .required()
        .messages({
            "any.only": "El estado solo puede ser '2' (Aprobado) o '3' (Rechazado)",
            "string.empty": "El estado no puede estar vacío",
            "any.required": "El estado es obligatorio"
        }),
    observaciones: Joi.string()
        .optional()
        .allow("")
        .messages({
            "string.base": "Las observaciones deben ser un texto"
        })
}).unknown(false).messages({
    "object.unknown": "No se permiten campos adicionales. Solo se puede actualizar 'estado' y opcionalmente 'observaciones'.",
});



