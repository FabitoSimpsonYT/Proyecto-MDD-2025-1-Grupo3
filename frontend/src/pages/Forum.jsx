import React, { useEffect, useState } from 'react';
import ThreadList from '../components/ThreadList';
import { useNavigate } from 'react-router-dom';
import '../styles/forum.css';
import { getThreads } from '../services/forum.service';

const Forum = () => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchThreads = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getThreads();
      setThreads(data);
    } catch (err) {
      setError(err.message || 'Error al cargar los hilos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  const navigate = useNavigate();

  if (loading) return <div className="forum-loading">Cargando hilos...</div>;
  if (error) return <div className="forum-error">{error}</div>;

  return (
    <div className="forum-container">
      <h1>Foro de la Comunidad</h1>
      <button
        className="btn-create-thread"
        style={{ marginBottom: 24, padding: '0.6em 1.5em', borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}
        onClick={() => navigate('/threads/create')}
      >
        Crear nuevo hilo
      </button>
      <ThreadList threads={threads} />
    </div>
  );
};

export default Forum;
