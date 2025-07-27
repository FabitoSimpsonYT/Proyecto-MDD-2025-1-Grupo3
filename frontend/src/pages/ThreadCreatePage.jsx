import { useNavigate } from 'react-router-dom';
import ThreadCreateForm from '../components/ThreadCreateForm';
import '../styles/forum.css';

const ThreadCreatePage = () => {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 520, margin: '7vh auto 0 auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <button
          onClick={() => navigate('/Forum')}
          style={{
            background: '#f1f5f9',
            border: '1.5px solid #2563eb',
            color: '#2563eb',
            fontWeight: 700,
            fontSize: 18,
            cursor: 'pointer',
            marginRight: 18,
            borderRadius: 8,
            padding: '0.35em 1.2em',
            transition: 'background 0.2s, color 0.2s',
            boxShadow: '0 1px 4px rgba(37,99,235,0.07)'
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = '#2563eb';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = '#f1f5f9';
            e.currentTarget.style.color = '#2563eb';
          }}
        >
          ← Volver
        </button>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>Crear nuevo hilo</h1>
      </div>
      <div style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 6px 32px rgba(0,0,0,0.10)' }}>
        <ThreadCreateForm />
      </div>
    </div>
  );
};

export default ThreadCreatePage;
