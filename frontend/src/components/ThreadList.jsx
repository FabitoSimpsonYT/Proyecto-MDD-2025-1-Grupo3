import React, { useState, useEffect } from 'react';
import { getUsers } from '../services/user.service';

const tipos = [
  { value: '', label: 'Todos' },
  { value: 'actividad', label: 'Actividad' },
  { value: 'comunicado', label: 'Comunicado' },
  { value: 'asamblea', label: 'Asamblea' },
];


const ThreadList = ({ threads }) => {
  const [filtro, setFiltro] = useState('');
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      const data = await getUsers();
      setUsuarios(data || []);
    };
    fetchUsuarios();
  }, []);

  const getNombreUsuario = (id) => {
    const user = usuarios.find(u => u.id === id);
    return user ? user.username || user.nombre || user.email : id;
  };

  const threadsFiltrados = filtro
    ? threads.filter(thread => thread.tipo.toLowerCase() === filtro)
    : threads;

  return (
    <>
      <div style={{ margin: '0 0 1.2rem 1.2rem' }}>
        <label htmlFor="filtro-tipo" style={{ fontWeight: 500, marginRight: 8 }}>Filtrar por tipo:</label>
        <select
          id="filtro-tipo"
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          style={{ padding: '0.3em 1em', borderRadius: 6, border: '1px solid #ddd' }}
        >
          {tipos.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div className="thread-list">
        {threadsFiltrados.length === 0 ? (
          <div style={{ margin: '1.5rem', color: '#888' }}>No hay hilos para este filtro.</div>
        ) : (
          threadsFiltrados.map(thread => (
            <div key={thread.id} className="thread-item">
              <div className="thread-header">
                <h3>{thread.titulo}</h3>
                <span className={`thread-type thread-type-${thread.tipo}`}>{thread.tipo}</span>
                {thread.soloLectura && <span className="thread-readonly">Solo lectura</span>}
              </div>
              <div className="thread-meta">
                <span>Creado por: {getNombreUsuario(thread.creadoPor)}</span>
                <span>Fecha: {new Date(thread.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default ThreadList;
