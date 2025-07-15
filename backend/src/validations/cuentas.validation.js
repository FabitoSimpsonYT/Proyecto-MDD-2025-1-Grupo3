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
    .min(7)
    .max(12)
    .required()
    .pattern(/^[0-9kK\-]+$/)
    .messages({
      "string.pattern.base": "El RUT solo puede tener números, guión y la letra K.",
      "string.min": "El RUT es demasiado corto.",
      "string.max": "El RUT es demasiado largo.",
      "string.empty": "Debes ingresar el RUT.",
      "any.required": "Debes ingresar el RUT.",
    }),
  saldo: Joi.number()
    .min(0)
    .required()
    .messages({
      "number.base": "El saldo debe ser un número.",
      "number.min": "El saldo no puede ser negativo.",
      "any.required": "Debes ingresar el saldo.",
    }),
  correo: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Debes ingresar un correo válido.",
      "string.empty": "Debes ingresar el correo.",
      "any.required": "Debes ingresar el correo.",
    }),
});