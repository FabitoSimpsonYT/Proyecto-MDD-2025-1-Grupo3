import React, { useEffect, useState } from 'react';
import { getHistorialPagosPorCuenta } from '../services/historialPagos.service';
import { confirmarPago, rechazarPago } from '../services/pagos.service';
import { useAuth } from '../context/AuthContext';

export default function HistorialPagosCuenta({ cuentaId }) {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isAdmin = user?.rol === 'admin';
  const [accionError, setAccionError] = useState("");

  useEffect(() => {
    if (!cuentaId) return;
    setLoading(true);
    getHistorialPagosPorCuenta(cuentaId)
      .then(data => setPagos(data))
      .finally(() => setLoading(false));
  }, [cuentaId]);

  if (!cuentaId) return null;
  if (loading) return <div>Cargando historial...</div>;

  const handleAccion = async (id, accion) => {
    setAccionError("");
    try {
      if (accion === 'confirmar') {
        await confirmarPago(id, { estado: 'confirmado', observacion: 'Confirmado por admin' });
      } else if (accion === 'rechazar') {
        await rechazarPago(id, { observacion: 'Rechazado por admin' });
      }

      setPagos(await getHistorialPagosPorCuenta(cuentaId));
    } catch {
      setAccionError('Error al procesar la acción');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '60vh', width: '100%' }}>
      <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', minWidth: '340px', maxWidth: '700px', width: '100%' }}>
        <h3 style={{ textAlign: 'center' }}>Historial de Pagos</h3>
        {accionError && <div style={{color:'red',textAlign:'center'}}>{accionError}</div>}
        <table className="cuentas-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Método</th>
              <th>Estado</th>
              <th>Tipo</th>
              <th>Observación</th>
              {isAdmin && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {pagos.length === 0 && (
              <tr><td colSpan={isAdmin ? 7 : 6}>Sin movimientos</td></tr>
            )}
            {pagos.map(p => (
              <tr key={p.id}>
                <td style={{color: p.tipo === 'egreso' ? 'red' : 'green'}}>
                  {p.tipo === 'egreso' ? '-' : '+'}${Number(p.monto).toFixed(2)}
                </td>
                <td>{new Date(p.fecha).toLocaleString()}</td>
                <td>{p.metodo}</td>
                <td>{p.estado}</td>
                <td>{p.tipo || 'general'}</td>
                <td>{p.observacion || ''}</td>
                {isAdmin && (
                  <td>
                    {p.estado === 'pendiente' && (
                      <div style={{display:'flex',gap:'4px'}}>
                        <button style={{background:'#27ae60',color:'#fff',border:'none',padding:'4px 10px',borderRadius:'4px',cursor:'pointer'}} onClick={() => handleAccion(p.id, 'confirmar')}>Confirmar</button>
                        <button style={{background:'#e74c3c',color:'#fff',border:'none',padding:'4px 10px',borderRadius:'4px',cursor:'pointer'}} onClick={() => handleAccion(p.id, 'rechazar')}>Rechazar</button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
