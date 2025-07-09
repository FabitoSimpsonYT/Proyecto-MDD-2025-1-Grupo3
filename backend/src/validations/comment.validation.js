"use strict";
import Joi from "joi";

export const commentValidation = Joi.object({
    contenido: Joi.string().min(1).max(500).required(),
    threadId: Joi.number().integer().required(),
});