import Joi from "joi";

export const createValidation = Joi.object({
  titulo: Joi.string()
  .min(3)
  .max(40)
  .required()
  .pattern(/^[\p{L}\p{N}\s]+$/u)
  .messages({
    "string.pattern.base": "El título solo puede tener letras y números.",
    "string.min": "El título debe tener más de 3 caracteres.",
    "string.max": "El título debe tener como máximo 40 caracteres.",
    "string.empty": "El título es obligatorio.",
  }),


  contenido: Joi.string()
  .min(3)
  .max(200)
  .required()
  .pattern(/^[\p{L}\p{N}\p{P}\p{Zs}]+$/u)
  .messages({
    "string.pattern.base": "El contenido solo puede contener letras, números y puntuación válida.",
    "string.min": "El contenido debe tener más de 3 caracteres.",
    "string.max": "El contenido debe tener como máximo 200 caracteres.",
    "string.empty": "El contenido es obligatorio.",
  }),

  comentario: Joi.string()
  .min(3)
  .max(200)
  .required()
  .pattern(/^[\p{L}\p{N}\p{P}\p{Zs}]+$/u)
  .messages({
    "string.pattern.base": "El comentario solo puede contener letras, números y puntuación válida.",
    "string.min": "El comentario debe tener más de 3 caracteres.",
    "string.max": "El comentario debe tener como máximo 200 caracteres.",
  }),

  categoria: Joi.string()
    .valid("sugerencia", "reclamo")
    .required()
    .messages({
      "any.only": "Debe seleccionar entre estos dos: sugerencia o reclamo.",
      "string.empty": "La categoría es obligatoria.",
    }),
})
.unknown(false)
.messages({
  "object.unknown": "No se permiten campos adicionales.",
});
