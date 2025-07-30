import { useNavigate } from 'react-router-dom';
import ThreadCreateForm from '../components/ThreadCreateForm';
import '../styles/forum.css';

const ThreadCreatePage = () => {
  const navigate = useNavigate();
  return (
    <div className="thread-create-page-container">
      <div className="thread-create-header">
        <button
          type="button"
          className="btn-back-thread"
          onClick={() => {
            if (window.confirm('¿Estás seguro de que quieres volver? Se perderán los cambios no guardados.')) {
              navigate('/Forum');
            }
          }}
        >
          ← Volver
        </button>
      </div>
      <div className="thread-create-content">
        <ThreadCreateForm />
      </div>
    </div>
  );
};

export default ThreadCreatePage;
