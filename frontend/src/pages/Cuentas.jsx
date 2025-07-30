import React, { useState, useEffect, useRef } from 'react';
import { getCuentas, createCuenta, updateCuenta, deleteCuenta } from '../services/cuentas.service';
import HistorialPagosCuenta from '../components/HistorialPagosCuenta';
import '../styles/cuentas.css';

export default function Cuentas() {
  const [cuentas, setCuentas] = useState([]);
  const [form, setForm] = useState({ nombre: '', saldo: '', rut: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [rutError, setRutError] = useState("");
  const [nombreError, setNombreError] = useState("");
  const formRef = useRef(null);

  const fetchCuentas = async () => {
    setCuentas(await getCuentas());
  };

  useEffect(() => {
    fetchCuentas();
  }, []);

  const rutRegex = /^\d{2}\.\d{3}\.\d{3}-[\dkK]$/;
  const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === "rut") {
      if (!rutRegex.test(value)) {
        setRutError("Formato rut inválido. Debe ser xx.xxx.xxx-x");
      } else {
        setRutError("");
      }
    }
    if (name === "nombre") {
      if (!nombreRegex.test(value)) {
        setNombreError("El nombre solo puede tener letras y espacios.");
      } else {
        setNombreError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rutRegex.test(form.rut)) {
      setRutError("Formato rut inválido. Debe ser xx.xxx.xxx-x");
      return;
    }
    if (!nombreRegex.test(form.nombre)) {
      setNombreError("El nombre solo puede tener letras y espacios.");
      return;
    }
    try {
      if (editId) {
        // Siempre enviar rut junto con nombre y saldo
        await updateCuenta(editId, {
          nombre: form.nombre,
          saldo: form.saldo,
          rut: form.rut
        });
        setEditId(null);
      } else {
        await createCuenta(form);
      }
      setForm({ nombre: '', saldo: '', rut: '' });
      setError("");
      setRutError("");
      fetchCuentas();
    } catch (err) {
      // Mostrar mensaje específico si es error de nombre
      if (err?.response?.data?.error?.includes("nombre")) {
        setNombreError(err.response.data.error);
      } else {
        setError(err?.response?.data?.message || err?.response?.data?.error || 'Error al guardar la cuenta');
      }
    }
  };

  const handleEdit = (cuenta) => {
    setEditId(cuenta.id);
    setForm({ nombre: cuenta.nombre, saldo: cuenta.saldo, rut: cuenta.rut });
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleDelete = async (id) => {
    try {
      await deleteCuenta(id);
      fetchCuentas();
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al eliminar la cuenta');
    }
  };

  return (
    <div className="cuentas-container" style={{ maxHeight: '100vh', overflow: 'auto', paddingBottom: '2rem', marginTop: '10rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Cuentas</h2>
      {error && <div style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}
      <form className="cuentas-form" onSubmit={handleSubmit} ref={formRef} style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 2, padding: '1rem 0', marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
        <input name="nombre" placeholder="Nombre (solo letras y espacios)" value={form.nombre} onChange={handleChange} required style={{ flex: '1 1 200px', minWidth: '180px', maxWidth: '300px' }} />
        {nombreError && <span style={{ color: 'red', width: '100%', textAlign: 'center' }}>{nombreError}</span>}
        <input name="saldo" placeholder="Saldo" value={form.saldo} onChange={handleChange} required type="number" style={{ flex: '1 1 120px', minWidth: '100px', maxWidth: '180px' }} />
        <input name="rut" placeholder="RUT (xx.xxx.xxx-x)" value={form.rut} onChange={handleChange} required style={{ flex: '1 1 180px', minWidth: '120px', maxWidth: '200px' }} />
        {rutError && <span style={{ color: 'red', width: '100%', textAlign: 'center' }}>{rutError}</span>}
        <button type="submit" style={{ flex: '1 1 120px', minWidth: '120px', maxWidth: '180px' }}>{editId ? 'Actualizar' : 'Crear'}</button>
        {editId && <button type="button" style={{ flex: '1 1 120px', minWidth: '120px', maxWidth: '180px' }} onClick={() => { setEditId(null); setForm({ nombre: '', saldo: '', rut: '' }); }}>Cancelar</button>}
      </form>
      <div style={{ overflowX: 'auto' }}>
        <table className="cuentas-table">
          <thead>
            <tr>
              <th>Nombre</th><th>Saldo</th><th>RUT</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cuentas.map(c => (
              <tr key={c.id}>
                <td>{c.nombre}</td>
                <td>{Number(c.saldo).toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>{c.rut}</td>
                <td>
                  <button onClick={() => handleEdit(c)}>Editar</button>
                  <button onClick={() => handleDelete(c.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mostrar historial solo si hay cuenta seleccionada para editar */}
      {editId && <HistorialPagosCuenta cuentaId={editId} />}
    </div>
  );
}
