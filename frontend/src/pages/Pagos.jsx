
import React, { useEffect, useState } from 'react';
import { getPagos, createPago, confirmarPago, rechazarPago } from '../services/pagos.service';
import { getCuentas } from '../services/cuentas.service';
import { useAuth } from '../context/AuthContext';
import '../styles/pagos.css';

export default function Pagos() {
  const [pagos, setPagos] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [form, setForm] = useState({ cuentaId: '', monto: '', tipo: '', metodo: '', observacion: '' });
  const [voucher, setVoucher] = useState(null);
  const { user } = useAuth();
  // Para observación personalizada admin
  const [adminObs, setAdminObs] = useState('');
  const [modal, setModal] = useState({ open: false, id: null, accion: null });

  const fetchPagos = async () => setPagos(await getPagos());
  const fetchCuentas = async () => setCuentas(await getCuentas());

  useEffect(() => {
    fetchPagos();
    fetchCuentas();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = e => setVoucher(e.target.files[0]);

  const handleSubmit = async e => {
    e.preventDefault();
    await createPago(form, voucher);
    setForm({ cuentaId: '', monto: '', tipo: '', metodo: '', observacion: '' });
    setVoucher(null);
    fetchPagos();
  };

  const openModal = (id, accion) => {
    setModal({ open: true, id, accion });
    setAdminObs('');
  };

  const closeModal = () => {
    setModal({ open: false, id: null, accion: null });
    setAdminObs('');
  };

  const handleAdminAction = async () => {
    if (modal.accion === 'confirmar') {
      await confirmarPago(modal.id, { estado: 'confirmado', observacion: adminObs || 'Confirmado por admin' });
    } else if (modal.accion === 'rechazar') {
      await rechazarPago(modal.id, { observacion: adminObs || 'Rechazado por admin' });
    }
    closeModal();
    fetchPagos();
  };

  return (
    <div className="pagos-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', marginTop: '40rem' }}>
      <h2 style={{ textAlign: 'center' }}>Pagos</h2>
      <form className="pagos-form" onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', background: '#fff', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', minWidth: '320px', maxWidth: '520px', width: '100%' }}>
        <select name="cuentaId" value={form.cuentaId} onChange={handleChange} required>
          <option value="">Seleccione cuenta</option>
          {cuentas.map(c => <option key={c.id} value={c.id}>{c.nombre} ({c.rut})</option>)}
        </select>
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
        <button type="submit">Registrar Pago</button>
      </form>
      <div style={{maxHeight:'600px',overflowY:'auto',width:'100%',margin:'0 auto',minWidth:'320px',maxWidth:'1000px'}}>
        <table className="pagos-table" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Cuenta</th>
            <th>Monto</th>
            <th>Tipo</th>
            <th>Método</th>
            <th>Estado</th>
            <th>Observación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {[...pagos].reverse().map(p => (
            <tr key={p.id}>
              <td>{p.nombreCuenta} ({p.rutCuenta})</td>
              <td>{p.monto}</td>
              <td>{p.tipo}</td>
              <td>{p.metodo}</td>
              <td>{p.estado}</td>
              <td>{p.observacion || ''}</td>
              <td>
                {(user?.rol === 'admin' || user?.rol === 'administrador') && p.estado === 'pendiente' && (
                  <>
                    <button style={{background:'#27ae60',color:'#fff',border:'none',padding:'4px 10px',borderRadius:'4px',cursor:'pointer',marginRight:'4px'}} onClick={() => openModal(p.id, 'confirmar')}>Confirmar</button>
                    <button style={{background:'#e74c3c',color:'#fff',border:'none',padding:'4px 10px',borderRadius:'4px',cursor:'pointer'}} onClick={() => openModal(p.id, 'rechazar')}>Rechazar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
      {/* Modal de observación admin */}
      {modal.open && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.2)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
          <div style={{background:'#fff',padding:'2rem',borderRadius:'10px',minWidth:'320px',boxShadow:'0 2px 8px rgba(0,0,0,0.15)'}}>
            <h4>{modal.accion === 'confirmar' ? 'Confirmar Pago' : 'Rechazar Pago'}</h4>
            <textarea
              placeholder={modal.accion === 'confirmar' ? 'Observación de confirmación' : 'Motivo de rechazo'}
              value={adminObs}
              onChange={e => setAdminObs(e.target.value)}
              style={{width:'100%',minHeight:'60px',marginBottom:'1rem'}}
            />
            <div style={{display:'flex',gap:'1rem',justifyContent:'flex-end'}}>
              <button onClick={closeModal} style={{padding:'6px 16px',borderRadius:'4px',border:'none',background:'#ccc'}}>Cancelar</button>
              <button onClick={handleAdminAction} style={{padding:'6px 16px',borderRadius:'4px',border:'none',background:modal.accion==='confirmar'?'#27ae60':'#e74c3c',color:'#fff'}}>
                {modal.accion === 'confirmar' ? 'Confirmar' : 'Rechazar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
