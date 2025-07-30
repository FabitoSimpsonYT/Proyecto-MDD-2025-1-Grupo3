"use strict";
import Joi from "joi";

export const createCuentaValidation = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(50)
    .required()
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .messages({
      "string.pattern.base": "El nombre solo puede tener letras y espacios.",
      "string.min": "El nombre debe tener al menos 3 letras.",
      "string.max": "El nombre no puede tener más de 50 letras.",
      "string.empty": "Debes ingresar el nombre.",
      "any.required": "Debes ingresar el nombre.",
    }),
  rut: Joi.string()
    .required()
    .pattern(/^\d{2}\.\d{3}\.\d{3}-[\dkK]$/)
    .messages({
      "string.empty": "El rut no puede estar vacío.",
      "string.base": "El rut debe ser de tipo string.",
      "string.pattern.base": "Formato rut inválido. Debe ser xx.xxx.xxx-x.",
    }),
  saldo: Joi.number()
    .min(0)
    .required()
    .messages({
      "number.base": "El saldo debe ser un número.",
      "number.min": "El saldo no puede ser negativo.",
      "any.required": "Debes ingresar el saldo.",
    }),
});