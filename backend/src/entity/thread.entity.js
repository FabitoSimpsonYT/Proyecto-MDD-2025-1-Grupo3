"use strict";

import { EntitySchema } from "typeorm";

export const ThreadEntity = new EntitySchema({
    name: "Thread",
    tableName: "threads",
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
        tipo: {
            type: String,
            nullable: false,
        },
        soloLectura: {
            type: Boolean,
            default: false,
        },
        creadoPor: {
            type: Number,
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
    relations: {
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: { name: "creadoPor" },
            onDelete: "CASCADE",
        },
    },
});

export default ThreadEntity;