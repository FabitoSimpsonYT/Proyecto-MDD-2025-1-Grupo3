"use strict"
import Joi from "joi"
export const createValidation = Joi.object({
    nombre: Joi.string()
    .min(3)
    .max(50)
    .required()
    .pattern(/^[a-zA-Z]+$/)
    .messages({
       "string.pattern.base":"el nombre solo debe de tener caracteres",
       "string.min":"el nombre debe de tener minimo tres caracteres",
       "string.max":"el nombre no debe exceder los 50 caracteres",
       "string.empty":"el nombre es obligatorio",
    }),
    edad:Joi.number()
    .min(18)
    .max(110)
    .required()
    .messages({
       "number.base":"la edad tiene que ser un numero",
       "number.min":"la edad minima permitida es 18 años",
       "number.max":"la edad maxima permitida es 110 años",
       "any.required":"la edad es obligatorio",
    }),
    numerocasa: Joi.string()
    .min(1)
    .max(20)
    .required()
    .pattern(/^[a-zA-Z0-9_]+$/)
    .messages({
       "string.pattern.base":"el numero de casa solo debe de tener caracteres",
       "string.min":"el numero de la casa debe de tener minimo 1 caracteres",
       "string.max":"el numero de la casa debe de tener como maximo 20 caracteres",
       "string.empty":"el numero de la casa es obligatorio",
    }),
    email : Joi.string()
    .email()
    .required()
    .min(10)
    .max(50)
    .messages({
        "string.email":"el correo electronico debe ser valido",
        "string.min":"el correo electronico debe tener al menos 10 caracteres",
        "string.max":"el correo electronico no puede exceder los 50 caracteres",
        "string.empty":"el correo electronico es obligatorio",
    }),
    descripcion: Joi.string()
  .min(10)
  .max(200)
  .required()
  .pattern(/^[a-zA-Z]+$/)
  .messages({
    "string.empty": "La descripción es obligatoria.",
    "string.min": "La descripción debe tener al menos 10 caracteres.",
    "string.max": "La descripción no debe exceder los 200 caracteres.",
    "string.pattern.base": "La descripción contiene caracteres inválidos.",
    "any.required": "El campo descripción es obligatorio.",
  }),

}).unknown(false)
.messages({"object.unknown":"no se permite campos adicionales"})


export const updatevalidation = Joi.object({
    nombre: Joi.string()
    .min(3)
    .max(50)
    .required()
    .pattern(/^[a-zA-Z]+$/)
    .messages({
       "string.pattern.base":"el nombre solo debe de tener caracteres",
       "string.min":"el nombre debe de tener minimo tres caracteres",
       "string.max":"el nombre no debe exceder los 50 caracteres",
       "string.empty":"el nombre es obligatorio",
    }),
    edad:Joi.number()
    .min(18)
    .max(110)
    .required()
    .messages({
       "number.base":"la edad tiene que ser un numero",
       "number.min":"la edad minimo permitida es 18 años",
       "number.max":"la edad maximo permitida es 110 años",
       "any.required":"la edad es obligatorio",
    }),
    numerocasa: Joi.string()
    .min(1)
    .max(20)
    .required()
    .pattern(/^[a-zA-Z0-9_]+$/)
    .messages({
       "string.pattern.base":"el numero de casa solo debe de tener caracteres",
       "string.min":"el numero de la casa debe de tener minimo 1 caracteres",
       "string.max":"el numero de la casa debe de tener como maximo 20 caracteres",
       "string.empty":"el numero de la casa es obligatorio",
    }),
    email : Joi.string()
    .email()
    .required()
    .min(15)
    .max(50)
    .messages({
        "string.email":"el correo electronico debe ser valido",
        "string.min":"el correo electronico debe tener al menos 15 caracteres",
        "string.max":"el correo electronico no puede exceder los 50 caracteres",
        "string.empty":"el correo electronico es obligatorio",
    }),
    descripcion: Joi.string()
    .min(10)
    .max(200)
    .required()
    .pattern(/^[a-zA-Z]+$/)
    .messages({
    "string.empty": "La descripción es obligatoria.",
    "string.min": "La descripción debe tener al menos 10 caracteres.",
    "string.max": "La descripción no debe exceder los 200 caracteres.",
    "string.pattern.base": "La descripción contiene caracteres inválidos.",
    "any.required": "El campo descripción es obligatorio.",
  }),
}).unknown(false)
.messages({"object.unknown":"no se permite campos adicionales"})