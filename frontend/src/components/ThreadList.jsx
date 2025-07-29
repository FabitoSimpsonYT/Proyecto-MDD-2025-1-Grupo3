import React, { useState, useEffect } from 'react';
import { getUsers, getPublicUsers } from '../services/user.service';
import { useNavigate, Link } from 'react-router-dom';

const tipos = [
  { value: '', label: 'Todos' },
  { value: 'actividad', label: 'Actividad' },
  { value: 'comunicado', label: 'Comunicado' },
  { value: 'asamblea', label: 'Asamblea' },
];


const ThreadList = ({ threads }) => {
  const [filtro, setFiltro] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();
  const usuario = JSON.parse(sessionStorage.getItem('usuario'));
  const userId = sessionStorage.getItem('id');
  const esAdmin = usuario?.rol === 'administrador';

  const getIdCreador = (id) => {
    const user = usuarios.find(u => String(u.id) === String(id));
    return user ? user.id : undefined;
  };

  useEffect(() => {
    const fetchUsuarios = async () => {
      let data;
      if (esAdmin) {
        data = await getUsers();
      } else {
        data = await getPublicUsers();
      }
      setUsuarios(data || []);
    };
    fetchUsuarios();
  }, [esAdmin]);

  const getNombreUsuario = (id) => {
    const user = usuarios.find(u => String(u.id) === String(id));
    return user ? user.nombre || user.username || user.email : id;
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
              <div className="thread-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Link to={`/threads/${thread.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3>{thread.titulo}</h3>
                    <span className={`thread-type thread-type-${thread.tipo}`}>{thread.tipo}</span>
                    {thread.soloLectura && <span className="thread-readonly">Solo lectura</span>}
                  </Link>
                </div>
                {(esAdmin || String(thread.creadoPor) === String(userId)) && (
                  <button
                    className="btn-edit-thread"
                    style={{ marginLeft: 16, padding: '0.3em 1em', borderRadius: 7, border: '1.5px solid #2563eb', background: '#f1f5f9', color: '#2563eb', fontWeight: 600, cursor: 'pointer', fontSize: 15 }}
                    onClick={() => navigate(`/threads/${thread.id}/edit`)}
                  >
                    Editar
                  </button>
                )}
              </div>

              <div className="thread-meta">
                <span>Creado por: {getNombreUsuario(thread.creadoPor)}</span>
                {thread.updatedAt && thread.updatedAt !== thread.createdAt ? (
                  <span>Editado hace {getTimeAgo(thread.updatedAt)}</span>
                ) : (
                  <span>{getTimeAgo(thread.createdAt)}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );


function getTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000); // en segundos
  if (diff < 60) return `hace ${diff} segundos`;
  if (diff < 3600) return `hace ${Math.floor(diff/60)} minutos`;
  if (diff < 86400) return `hace ${Math.floor(diff/3600)} horas`;
  if (diff < 2592000) return `hace ${Math.floor(diff/86400)} días`;
  if (diff < 31536000) return `hace ${Math.floor(diff/2592000)} meses`;
  return `hace ${Math.floor(diff/31536000)} años`;
}

};

export default ThreadList;
