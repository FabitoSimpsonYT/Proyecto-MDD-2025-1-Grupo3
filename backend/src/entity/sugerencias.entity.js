"use strict";

import { EntitySchema } from "typeorm";

export const Publicacion = new EntitySchema({
    name: "Sugerencia",
    tableName: "Sugerencias",
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        titulo: {
            type: String,
            nullable: false,
        },
        contenido: {
            type: String,
            nullable: false,
        },
        categoria: {
          type: String,
          enum: ["Sugerencia", "Reclamo"],
        },
        estado: {
            type: String,
            default: 'pendiente'
        },
        comentario: {
            type: String,
            nullable: true,
        },
    },
});