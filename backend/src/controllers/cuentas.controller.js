import { AppDataSource } from "../config/configDb.js";
import CuentaSchema from "../entity/cuenta.entity.js";
import { createCuentaValidation } from "../validations/cuentas.validation.js";

const cuentaRepository = () => AppDataSource.getRepository(CuentaSchema);


export const registrarUsuario = async (req, res) => {
  const { error } = createCuentaValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const { nombre, saldo, rut } = req.body;
    const nuevaCuenta = cuentaRepository().create({ nombre, saldo, rut });
    await cuentaRepository().save(nuevaCuenta);
    res.status(201).json(nuevaCuenta);
  } catch (error) {
    res.status(500).json({ error: "Error al registrar la cuenta" });
  }
};


export const listarUsuarios = async (req, res) => {
  try {
    const lista = await cuentaRepository().find();
    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: "Error al listar cuentas" });
  }
};


export const modificarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, saldo, rut } = req.body;
  try {
    const cuenta = await cuentaRepository().findOneBy({ id: Number(id) });
    if (!cuenta) {
      console.error("Cuenta no encontrada para id:", id);
      return res.status(404).json({ error: "Cuenta no encontrada" });
    }

    const validacion = { nombre, saldo, rut: rut || cuenta.rut };
    const { error } = createCuentaValidation.validate(validacion);
    if (error) {
      console.error("Error de validación al actualizar cuenta:", validacion, error.details[0].message);
      return res.status(400).json({ error: error.details[0].message, data: validacion });
    }
    cuenta.nombre = nombre;
    cuenta.saldo = saldo;
    await cuentaRepository().save(cuenta);
    res.json(cuenta);
  } catch (error) {
    console.error("Error inesperado al actualizar cuenta:", error);
    res.status(500).json({ error: "Error al actualizar la cuenta" });
  }
};


export const eliminarCuenta = async (req, res) => {
  try {
    const { id } = req.params;
    const cuenta = await cuentaRepository().findOneBy({ id: Number(id) });
    if (!cuenta) {
      return res.status(404).json({ error: "Cuenta no encontrada" });
    }
    await cuentaRepository().delete({ id: Number(id) });
    res.json({ message: "Cuenta eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la cuenta" });
  }
};


export const restarSaldo = async (req, res) => {
  try {
    const { id } = req.params;
    const { monto } = req.body;
    if (Number(monto) <= 0) {
      return res.status(400).json({ error: "El monto debe ser mayor a cero." });
    }
    const cuenta = await cuentaRepository().findOneBy({ id: Number(id) });
    if (!cuenta) {
      return res.status(404).json({ error: "Cuenta no encontrada" });
    }
    if (Number(cuenta.saldo) < Number(monto)) {
      return res.status(400).json({ error: "No puedes restar más que el saldo actual." });
    }
    cuenta.saldo = Number(cuenta.saldo) - Number(monto);
    await cuentaRepository().save(cuenta);
    res.json(cuenta);
  } catch (error) {
    res.status(500).json({ error: "Error al restar saldo" });
  }
};
