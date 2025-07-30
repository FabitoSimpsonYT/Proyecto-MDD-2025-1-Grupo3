
import React, { useState, useEffect } from 'react';
import { createPago } from '../services/pagos.service';
import { useAuth } from '../context/AuthContext';
import { getCuentas } from '../services/cuentas.service';

export default function CrearPagoUsuario({ onPagoCreado }) {
  const [form, setForm] = useState({ monto: '', tipo: '', metodo: '', observacion: '' });
  const [voucher, setVoucher] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cuentaId, setCuentaId] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    async function fetchCuenta() {
      try {
        const cuentas = await getCuentas();
        const cuenta = cuentas.find(c => c.rut === user?.rut);
        if (cuenta) setCuentaId(cuenta.id);
        else setError('No tienes una cuenta asociada. Contacta al administrador.');
      } catch {
        setError('No se pudo obtener la cuenta del usuario');
      }
    }
    fetchCuenta();
  }, [user]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = e => setVoucher(e.target.files[0]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!cuentaId) {
      setError('No se encontró la cuenta del usuario.');
      return;
    }
    try {
      await createPago({ ...form, cuentaId: Number(cuentaId) }, voucher);
      setForm({ monto: '', tipo: '', metodo: '', observacion: '' });
      setVoucher(null);
      setSuccess('Pago solicitado correctamente. Espera confirmación del administrador.');
      if (onPagoCreado) onPagoCreado();
    } catch (err) {
      setError(err?.response?.data?.error || 'Error al solicitar el pago');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '60vh', width: '100%' }}>
      <div className="crear-pago-usuario-container" style={{ background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', minWidth: '340px', maxWidth: '700px', width: '100%' }}>
        <h3 style={{ textAlign: 'center' }}>Solicitar Nuevo Pago</h3>
        <form className="cuentas-form" onSubmit={handleSubmit}>
          <input name="monto" placeholder="Monto" value={form.monto} onChange={handleChange} required type="number" />
          <select name="tipo" value={form.tipo} onChange={handleChange} required>
            <option value="">Tipo</option>
            <option value="general">General</option>
            <option value="extra">Extra</option>
          </select>
          <select name="metodo" value={form.metodo} onChange={handleChange} required>
            <option value="">Método</option>
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
          </select>
          <input name="observacion" placeholder="Observación" value={form.observacion} onChange={handleChange} />
          <input type="file" onChange={handleFile} />
          <button type="submit">Solicitar Pago</button>
        </form>
        {error && <div style={{color:'red', marginTop:'1rem'}}>{error}</div>}
        {success && <div style={{color:'green', marginTop:'1rem'}}>{success}</div>}
      </div>
    </div>
  );
}
