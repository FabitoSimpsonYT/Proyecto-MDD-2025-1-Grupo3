import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createThread } from '../services/forum.service';

const tipos = [
  { value: 'actividad', label: 'Actividad' },
  { value: 'comunicado', label: 'Comunicado' },
  { value: 'asamblea', label: 'Asamblea' },
];

const ThreadCreateForm = ({ onCreated }) => {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('actividad');
  const [soloLectura, setSoloLectura] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createThread({ titulo, tipo, soloLectura });
      setTitulo('');
      setTipo('actividad');
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
      <div>
        <label>Título:</label>
        <input
          type="text"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Tipo:</label>
        <select value={tipo} onChange={e => setTipo(e.target.value)}>
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
        style={{
          marginTop: 18,
          padding: '0.6em 1.7em',
          borderRadius: 8,
          background: loading ? '#a5b4fc' : '#2563eb',
          color: '#fff',
          border: 'none',
          fontWeight: 700,
          fontSize: '1.08rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: '0 1px 4px rgba(37,99,235,0.07)',
          transition: 'background 0.2s, color 0.2s',
        }}
        onMouseOver={e => {
          if (!loading) e.currentTarget.style.background = '#1d4ed8';
        }}
        onMouseOut={e => {
          if (!loading) e.currentTarget.style.background = '#2563eb';
        }}
      >
        {loading ? 'Creando...' : 'Crear hilo'}
      </button>
    </form>
  );
};

export default ThreadCreateForm;
