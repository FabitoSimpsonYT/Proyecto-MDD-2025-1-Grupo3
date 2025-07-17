"use strict";

import { AppDataSource } from "../config/configDb.js";
import { AttendanceEntity } from "../entity/attendance.entity.js";
import { attendanceValidation } from "../validations/attendance.validation.js";

export const createAttendance = async (req, res) => {
    try {
        const { threadId, asistencia } = req.body;
        const user = req.user;
        const { error } = attendanceValidation.validate(req.body);  
        if (error) return res.status(400).json({ message: error.message });
        if (typeof asistencia !== 'boolean') {
            return res.status(400).json({ message: "datos invalidos" });
        }
        const attendanceRepo = AppDataSource.getRepository(AttendanceEntity);
        let attendance = await attendanceRepo.findOne({
            where: { usuarioId: user.id, threadId }
        });
        if (attendance) {
            attendance.asistencia = asistencia;
            await attendanceRepo.save(attendance);
            return res.json({ message: "aistencia actualizada", data: attendance });
        }else { 
            attendance = attendanceRepo.create({
                usuarioId: user.id,
                threadId,
                asistencia
            });
            await attendanceRepo.save(attendance);
            return res.status(201).json({ message: "asistencia confirmada", data: attendance });
        } 
    } catch (error) {
            res.status(500).json({ message: "Error confirmar asistencia", error: error.message });
    }
};

export const getAttendanceByThread = async (req, res) => {
    try {
        const { threadId } = req.params;
        const attendanceRepo = AppDataSource.getRepository("Attendance");
        const attendance = await attendanceRepo.find({ where: { threadId: Number(threadId) } });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener asistencia", error: error.message });
    }
};