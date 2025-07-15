"use strict";
import { AppDataSource } from "../config/configDb.js";
import { EntitySchema } from "typeorm";

const CuentaSchema = new EntitySchema({
  name: "Cuenta",
  tableName: "cuentas",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre: {
      type: "varchar",
      nullable: false,
    },
    rut: {
      type: "varchar",
      length: 12,
      nullable: false,
      unique: true,
    },
    saldo: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
      default: 0,
    },
    correo: {
      type: "varchar",
      length: 100,
      nullable: false,
      unique: true,
    },
  },
});


export default CuentaSchema;