import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getThreads, updateThread } from '../services/forum.service';
import '../styles/threadCreateForm.css';

const tipos = [
  { value: 'actividad', label: 'Actividad' },
  { value: 'comunicado', label: 'Comunicado' },
  { value: 'asamblea', label: 'Asamblea' },
];

const ThreadEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [thread, setThread] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('actividad');
  const [soloLectura, setSoloLectura] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const threads = await getThreads();
        const t = threads.find(th => String(th.id) === String(id));
        if (t) {
          setThread(t);
          setTitulo(t.titulo);
          setTipo(t.tipo);
          setSoloLectura(t.soloLectura);
        } else {
          setError('Hilo no encontrado');
        }
      } catch {
        setError('Error al cargar el hilo');
      }
    };
    fetchThread();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await updateThread(id, { titulo, tipo, soloLectura });
      navigate('/forum');
    } catch (err) {
      setError(err.message || 'Error al actualizar el hilo');
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="form-error">{error}</div>;
  if (!thread) return <div>Cargando...</div>;

  const usuario = JSON.parse(sessionStorage.getItem('usuario'));
  const esAdmin = usuario?.rol === 'administrador';

  return (
    <form className="thread-create-form" onSubmit={handleSubmit}>
      <h2>Editar hilo</h2>
      <div className="form-group">
        <label className="form-label">Título</label>
        <textarea
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          required
          className="form-input"
          rows={3}
          style={{ resize: 'vertical', minHeight: 48, maxHeight: 180 }}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Tipo</label>
        <select
          value={tipo}
          onChange={e => setTipo(e.target.value)}
          className="form-input"
        >
          {tipos.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      {esAdmin && (
        <div>
          <label>
            <input
              type="checkbox"
              checked={soloLectura}
              onChange={e => setSoloLectura(e.target.checked)}
            />
            Solo lectura
          </label>
        </div>
      )}
      {error && <div className="form-error">{error}</div>}
      <button
        type="submit"
        disabled={loading}
        className={`btn-create-thread${loading ? ' loading' : ''}`}
      >
        {loading ? 'Actualizando...' : 'Actualizar hilo'}
      </button>
    </form>
  );
};

export default ThreadEditForm;
