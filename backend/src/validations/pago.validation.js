"use strict";
import Joi from "joi";

export const createPagoValidation = Joi.object({
  cuentaId: Joi.number()
    .integer()
    .required()
    .messages({
      "number.base": "Por favor, selecciona una cuenta válida.",
      "number.integer": "Por favor, selecciona una cuenta válida.",
      "any.required": "Debes elegir una cuenta.",
    }),
  monto: Joi.number()
    .positive()
    .required()
    .messages({
      "number.base": "Ingresa un monto válido.",
      "number.positive": "El monto debe ser mayor a cero.",
      "any.required": "Debes ingresar el monto a pagar.",
    }),
  metodo: Joi.string()
    .valid("transferencia", "efectivo")
    .required()
    .messages({
      "any.only": "Elige si pagas por transferencia o en efectivo.",
      "string.empty": "Debes elegir cómo vas a pagar.",
    }),
  tipo: Joi.string()
    .valid("general", "extra")
    .required()
    .messages({
      "any.only": "El tipo de pago debe ser 'general' o 'extra'.",
      "string.empty": "Debes elegir el tipo de pago.",
    }),
  voucher: Joi.alternatives().conditional("metodo", {
    is: "transferencia",
    then: Joi.string().pattern(/^[a-zA-Z0-9\-_\.]+$/).required().messages({
      "any.required": "Debes subir el comprobante de transferencia.",
      "string.pattern.base": "El nombre del archivo del comprobante no es válido.",
    }),
    otherwise: Joi.string().allow(null, ""),
  }),
  observacion: Joi.string().allow(null, ""),
});
