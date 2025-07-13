"use strict"

import { EntitySchema, ForeignKey } from "typeorm";

export const soliEspaciosEntity = new EntitySchema({
    name: "soliEspacio",
    tableName: "soliEspacios",
    columns: {
        idSolicitud: {
            type: Number,
            primary: true,
            generated: true,
        },
        rutSolicitante: {
            type: String,
            nullable: false,
        },
        nombreSolicitante: {
            type: String,
            nullable: false,
        },
        idEspacioSol: {
            type: Number,
            ForeignKey: true,
            nullable: false,
        },
        descripcion: {
            type: String,
            nullable: false,
        },
        estado: {
            type: String,
            enum: ["1", "2", "3"],
            default: "1",
        },
        fechaInicio: {
            type: Date,
            nullable: false,
        },
        fechaFin: {
            type: Date,
            nullable: false,
        },
        horaInicio: {
            type: "time",
            nullable: false,
        },
        horaFin: {
            type: "time",
            nullable: false,
        },
        observaciones: {
            type: String,
            default: "Sin observaciones",
        },
        createdAt: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        updatedAt: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: () => "CURRENT_TIMESTAMP",
        },
    },
});


export default soliEspaciosEntity;