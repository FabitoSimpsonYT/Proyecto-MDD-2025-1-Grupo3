import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getThreads } from '../services/forum.service';
import Comments from '../components/Comments';
import AttendanceButton from '../components/AttendanceButton';

const ThreadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThread = async () => {
      setLoading(true);
      setError(null);
      try {
        const threads = await getThreads();
        const t = threads.find(th => String(th.id) === String(id));
        if (t) setThread(t);
        else setError('Hilo no encontrado');
      } catch (err) {
        setError('Error al cargar el hilo');
      } finally {
        setLoading(false);
      }
    };
    fetchThread();
  }, [id]);

  if (loading) return <div>Cargando hilo...</div>;
  if (error) return <div className="form-error">{error}</div>;
  if (!thread) return null;

  return (
    <div className="thread-detail-page" style={{ maxWidth: 600, margin: '20rem auto 2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #0001', padding: '2rem' }}>
      <button
        type="button"
        className="btn-back-thread"
        style={{ marginBottom: 24 }}
        onClick={() => navigate('/forum')}
      >
        ← Volver
      </button>
      <h2 style={{ marginBottom: 12 }}>{thread.titulo}</h2>
      <div style={{ marginBottom: 8 }}><b>Tipo:</b> {thread.tipo}</div>
      <div style={{ marginBottom: 8, color: '#888' }}>
        Creado por: {thread.creadoPor} | {new Date(thread.createdAt).toLocaleString()}
      </div>
      {thread.tipo === 'asamblea' && (
        <>
          <div className="attendance-section" style={{ marginTop: '1rem', marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h5 className="mb-3">Asistencia</h5>
            <AttendanceButton threadId={thread.id} />
          </div>
        </>
      )}
      <Comments threadId={thread.id} soloLectura={thread.soloLectura} />
    </div>
  );
};

export default ThreadDetail;
