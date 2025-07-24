"use strict";

import { EntitySchema } from "typeorm";
import { UserEntity } from "./user.entity.js";

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
        createdAt :{
            type :"timestamp",
            default : () => "CURRENT_TIMESTAMP",
        },
        updatedAt: {
            type :"timestamp",
            default : () =>"CURRENT_TIMESTAMP",
            onUpdate : () =>"CURRENT_TIMESTAMP",
        },
    },
    relations: {
        autor: {
        type: "many-to-one",
        target: UserEntity,    
        joinColumn: {
            name: "autorId",   
             },
        eager: true,          
        nullable: true,      
     },
  },
});