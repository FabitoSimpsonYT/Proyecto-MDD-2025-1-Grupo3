import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createThread } from '../services/forum.service';
import '../styles/threadCreateForm.css';

const tipos = [
  { value: '', label: 'Selecciona un tipo...' },
  { value: 'actividad', label: 'Actividad' },
  { value: 'comunicado', label: 'Comunicado' },
  { value: 'asamblea', label: 'Asamblea' },
];

const ThreadCreateForm = ({ onCreated }) => {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('');
  const [soloLectura, setSoloLectura] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await createThread({ titulo, tipo, soloLectura });
      setTitulo('');
      setTipo('');
      setSoloLectura(false);
      if (onCreated) onCreated();
      navigate('/forum');
    } catch (err) {
      setError(err.message || 'Error al crear el hilo');
    } finally {
      setLoading(false);
    }
  };

  const usuario = JSON.parse(sessionStorage.getItem('usuario'));
  const esAdmin = usuario?.rol === 'administrador';

  return (
    <form className="thread-create-form" onSubmit={handleSubmit}>
      <h2>Crear nuevo hilo</h2>
      <div className="form-group">
        <label className="form-label"></label>
        <textarea
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          className="form-input"
          required
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
          required
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
      <button
        type="submit"
        disabled={loading}
        className={`btn-create-thread${loading ? ' loading' : ''}`}
      >
        {loading ? 'Creando...' : 'Crear hilo'}
      </button>
    </form>
  );
};

export default ThreadCreateForm;
