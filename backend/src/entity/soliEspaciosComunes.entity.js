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
            enum: ["Sin Respuesta", "Aprobado", "Rechazado"],
            default: "Sin Respuesta",
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
    relations: {
        espacio: {
            type: "many-to-one",
            target: "EspacioComun",
            joinColumn: { name: "idEspacioSol"},
            onDelete: "CASCADE",
        },
        Solicitante: {
            type: "many-to-one",
            target: "User",
            joinColumn: { name: "idSolicitante" },
            nullable: false, // <-- asegúrate que no sea nulo
            onDelete: "CASCADE",
        },
    },
});


export default soliEspaciosEntity;