
import React, { useEffect, useState } from 'react';
import { getHistorialPagosUsuario } from '../services/historialPagosUsuario.service';
import '../styles/historialPagosUsuario.css';

export default function HistorialPagosUsuario() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getHistorialPagosUsuario()
      .then(setPagos)
      .catch(() => setError('No se pudo cargar el historial'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Cargando historial...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;

  return (
    <div className="historial-usuario-container">
      <h3>Mi Historial de Pagos</h3>
      <table className="cuentas-table">
        <thead>
          <tr>
            <th>Monto</th>
            <th>Tipo</th>
            <th>Método</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Observación</th>
          </tr>
        </thead>
        <tbody>
          {[...pagos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).map(p => (
            <tr key={p.id}>
              <td>{p.monto}</td>
              <td>{p.tipo}</td>
              <td>{p.metodo}</td>
              <td>{p.estado}</td>
              <td>{new Date(p.fecha).toLocaleString()}</td>
              <td>{p.observacion || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
