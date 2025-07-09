"use strict";
import Joi from "joi";

export const createValidation = Joi.object({
    nombreEspacio: Joi.string()
    .min(3)
    .max(50)
    .required()
    .pattern(/^[a-zA-Z0-9\s]+$/)
    .messages({
        "string.pattern.base": "El nombre solo puede contener letras, números y espacios.", 
        "string.min": "El nombre debe tener al menos 3 caracteres.",
        "string.max": "El nombre no puede exceder los 50 caracteres.",
        "string.empty": "El nombre es obligatorio.",
    }),
    direccionEspacio: Joi.string()
    .min(3)
    .max(100)
    .required()
    .pattern(/^[a-zA-Z0-9\s,.-]+$/)
    .messages({
        "string.pattern.base": "La dirección solo puede contener letras, números, espacios, comas, puntos y guiones.",
        "string.min": "La dirección debe tener al menos 3 caracteres.",
        "string.max": "La dirección no puede exceder los 100 caracteres.",
        "string.empty": "La dirección es obligatoria.",
    }),
}).unknown(false).messages({
    "object.unknown": "No se permiten campos adicionales",
});

export const updateValidation = Joi.object({
    nombreEspacio: Joi.string()
    .min(3)
    .max(50)
    .required()
    .pattern(/^[a-zA-Z0-9\s]+$/)
    .messages({
        "string.pattern.base": "El nombre solo puede contener letras, números y espacios.", 
        "string.min": "El nombre debe tener al menos 3 caracteres.",
        "string.max": "El nombre no puede exceder los 50 caracteres.",
        "string.empty": "El nombre es obligatorio.",
    }),
    direccionEspacio: Joi.string()
    .min(3)
    .max(100)
    .required()
    .pattern(/^[a-zA-Z0-9\s,.-]+$/)
    .messages({
        "string.pattern.base": "La dirección solo puede contener letras, números, espacios, comas, puntos y guiones.",
        "string.min": "La dirección debe tener al menos 3 caracteres.",
        "string.max": "La dirección no puede exceder los 100 caracteres.",
        "string.empty": "La dirección es obligatoria.",
    }),
}).unknown(false).messages({
    "object.unknown": "No se permiten campos adicionales",
});