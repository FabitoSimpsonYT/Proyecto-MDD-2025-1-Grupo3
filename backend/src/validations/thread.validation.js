"use strict";
import Joi from "joi";

export const threadValidation = Joi.object({
    titulo: Joi.string().min(3).max(100).required(),
    tipo: Joi.string().valid("comunicado", "actividad", "asamblea").required(),
    soloLectura: Joi.boolean().required(),
});