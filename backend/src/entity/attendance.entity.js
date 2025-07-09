"use strict";

import { EntitySchema } from "typeorm";

export const AttendanceEntity = new EntitySchema({
    name: "Attendance",
    tableName: "attendances",
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        usuarioId: {
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
            joinColumn: { name: "usuarioId" },
            onDelete: "CASCADE",
        },
        thread: {
            type: "many-to-one",
            target: "Thread",
            joinColumn: { name: "ThreadId" },
            onDelete: "CASCADE",
        },
    },
});

export default AttendanceEntity;