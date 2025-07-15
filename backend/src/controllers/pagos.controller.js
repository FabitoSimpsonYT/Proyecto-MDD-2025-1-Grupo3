import { AppDataSource } from "../config/configDb.js";
import PagoSchema from "../entity/pago.entity.js";
import CuentaSchema from "../entity/cuenta.entity.js";
import { createPagoValidation } from "../validations/pago.validation.js";

const pagoRepository = () => AppDataSource.getRepository(PagoSchema);
const cuentaRepository = () => AppDataSource.getRepository(CuentaSchema);

export async function crearPago(data) {
  const nuevoPago = pagoRepository().create(data);
  return await pagoRepository().save(nuevoPago);
}

export async function listarPagos() {
  return await pagoRepository().find();
}

export async function obtenerPagoPorId(id) {
  return await pagoRepository().findOneBy({ id: Number(id) });
}

export async function confirmarPago(id, estado, observacion) {
  const pago = await pagoRepository().findOneBy({ id: Number(id) });
  if (!pago) return null;
  pago.estado = estado;
  pago.observacion = observacion;
  return await pagoRepository().save(pago);
}

export const registrarPago = async (req, res) => {

  const data = {
    ...req.body,
    voucher: req.file ? req.file.filename : null,
    observacion: req.body.observacion || null, 
  };
  // Validación con Joi
  const { error } = createPagoValidation.validate(data);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    
    const cuenta = await cuentaRepository().findOneBy({ id: Number(data.cuentaId) });
    if (!cuenta) return res.status(404).json({ error: "Cuenta no encontrada" });

   
    if (data.tipo === "general") {
      
      if (data.metodo === "efectivo") {
        cuenta.saldo = 0;
        await cuentaRepository().save(cuenta);
      } else {
       
        if (Number(data.monto) > Number(cuenta.saldo)) {
          return res.status(400).json({ error: "El monto excede la deuda de la cuenta." });
        }
      }
    }
   

    const nuevoPago = await crearPago(data);
    res.status(201).json(nuevoPago);
  } catch (err) {
    res.status(500).json({ error: "Error al registrar el pago" });
  }
};

export const obtenerPagos = async (req, res) => {
  try {
    const pagos = await listarPagos();
    const cuentas = await cuentaRepository().find();

    const pagosConDatosCuenta = pagos.map(pago => {
      const cuenta = cuentas.find(c => c.id === pago.cuentaId);
      return {
        ...pago,
        nombreCuenta: cuenta ? cuenta.nombre : "Desconocido",
        rutCuenta: cuenta ? cuenta.rut : "Desconocido",
        correoCuenta: cuenta ? cuenta.correo : "Desconocido"
      };
    });

    res.json(pagosConDatosCuenta);
  } catch (error) {
    res.status(500).json({ error: "Error al listar pagos" });
  }
};

export const confirmarPagoAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, observacion } = req.body; 
    const pago = await obtenerPagoPorId(id);
    if (!pago) return res.status(404).json({ error: "Pago no encontrado" });

    const actualizado = await confirmarPago(id, estado, observacion);

    
    if (estado === "confirmado" && pago.metodo === "transferencia" && pago.tipo === "general") {
      const cuenta = await cuentaRepository().findOneBy({ id: Number(pago.cuentaId) });
      if (cuenta) {
        cuenta.saldo = Number(cuenta.saldo) - Number(pago.monto);
        await cuentaRepository().save(cuenta);
      }
    }

    
    res.json({ message: "Pago confirmado y saldo actualizado", pago: actualizado });
  } catch (error) {
    res.status(500).json({ error: "Error al confirmar pago" });
  }
};
