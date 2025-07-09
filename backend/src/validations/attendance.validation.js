"use strict";
import Joi from "joi";

export const attendanceValidation = Joi.object({
    threadId: Joi.number().integer().required(),
    asistencia: Joi.boolean().required(),
});