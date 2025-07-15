"use strict";
import { AppDataSource } from "../config/configDb.js";
import { EntitySchema } from "typeorm";

const PagoSchema = new EntitySchema({
  name: "Pago",
  tableName: "pagos",
  columns: {
    id: { type: "int",
        primary: true,
        generated: true },


    cuentaId: { type: "int",
                nullable: false },



                
    monto: { type: "decimal",
            precision: 10,
            scale: 2,
            nullable: false },

    fecha: { type: "timestamp",
            default: () => "CURRENT_TIMESTAMP" },

    metodo: { type: "varchar",
            nullable: false },
            
            
    voucher: { type: "varchar",
         nullable: true },
        
    estado: { type: "varchar",
         default: "pendiente" },

    observacion: { type: "varchar", 
        nullable: true },

    tipo: { type: "varchar", 
        nullable: false }, 
  },
});


export default PagoSchema;