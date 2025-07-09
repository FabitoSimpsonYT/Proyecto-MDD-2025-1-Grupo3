"use strict";

import { EntitySchema } from "typeorm";

export const CommentEntity = new EntitySchema({
    name: "Comment",
    tableName: "comments",
    columns: {
        id:{
            type: Number,
            primary: true,
            generated: true,
        },
        contenido: {
            type: String,
            nullable: false,
        },
        threadId: {
            type: Number,
            nullable: false,
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
        thread: {
            type: "many-to-one",
            target: "Thread",
            joinColumn: { name: "threadId" },
            onDelete: "CASCADE",
        },
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: { name: "creadoPor" },
            onDelete: "CASCADE",
        },
    },
});

export default CommentEntity;
