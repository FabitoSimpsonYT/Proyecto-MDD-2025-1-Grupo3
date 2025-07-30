"use strict"
import Joi from "joi"
export const createValidation = Joi.object({
    nombre: Joi.string()
    .min(3)
    .max(50)
    .required()
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
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
    .pattern(/^[a-zA-Z0-9\s]+$/) // Solo una barra invertida para espacio
    .messages({
    "string.pattern.base": "el numero de casa solo debe contener letras, números y espacios",
    "string.min": "el número de casa debe tener al menos 1 caracter",
    "string.max": "el número de casa debe tener como máximo 20 caracteres",
    "string.empty": "el número de casa es obligatorio",
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
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,!?¡¿'"()-]+$/)
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
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .messages({
      "string.pattern.base": "El nombre solo puede contener letras y espacios.",
    }),

  edad: Joi.number()
    .min(18)
    .max(110)
    .messages({
      "number.base": "La edad debe ser un número.",
    }),

  numerocasa: Joi.string()
    .min(1)
    .max(20)
    .pattern(/^[a-zA-Z0-9\s]+$/)
    .messages({
      "string.pattern.base": "El número de casa no puede contener caracteres especiales.",
    }),

  email: Joi.string()
    .email()
    .min(10)
    .max(50)
    .messages({
      "string.email": "El email debe tener un formato válido.",
    }),

 descripcion: Joi.string()
  .min(10)
  .max(200)
  .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,!?¡¿'"()-]+$/)
  .optional()
  .messages({
    "string.pattern.base": "La descripción contiene caracteres inválidos.",
  }),
}).unknown(false); // evita que se envíen otros campos no definidos
