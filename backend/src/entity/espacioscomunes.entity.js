"use strict";

import { EntitySchema } from "typeorm";

export const EspaciosComunesEntity = new EntitySchema({
    name: "EspacioComun",
    tableName: "espacios",
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        nombreEspacio: {
            type: String,
            unique: true,
            nullable: false,
        },
        direccionEspacio: {
            type: String,
            unique: true,
            nullable: false,
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

export default EspaciosComunesEntity;