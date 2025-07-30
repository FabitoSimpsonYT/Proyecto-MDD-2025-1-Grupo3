"use strict"
import { Column, EntitySchema, Generated, JoinColumn, Table, UpdateDateColumn } from "typeorm";
import{ UserEntity } from "./user.entity.js";

export const visitanteEntity = new EntitySchema({
    name :"visitante",
    tableName :"visitantes",
    target:"visitante",
    columns : {
        id : {
         primary : true ,
         type : "int",
         generated : true
        },
        nombre :{
            type : "varchar"
        },
        edad :{
            type:"int"
        },
        numerocasa :{
            type:"varchar"
        },
        email : {
            type: "varchar"
        },
        descripcion :{
            type:"varchar",
            nullable: true
        },
        createdAt: {
          type: "timestamp",
          default: () => "CURRENT_TIMESTAMP",      

        },
        updatedAt: {
            type :"timestamp",
            default : () =>"CURRENT_TIMESTAMP",
            onUpdate : () =>"CURRENT_TIMESTAMP",
        },

    },
    relations: {
      residente: {
        type: "many-to-one",
        target: "User", // nombre definido en UserEntity
        joinColumn: true,
        onDelete: "CASCADE",
      },
    },

});


export default visitanteEntity ;