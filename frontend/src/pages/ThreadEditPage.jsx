import { useParams, useNavigate } from 'react-router-dom';
import ThreadEditForm from '../components/ThreadEditForm';
import '../styles/threadCreateForm.css';

const ThreadEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="thread-create-page-container">
      <div className="thread-create-header">
        <button
          type="button"
          className="btn-back-thread"
          onClick={() => {
            if (window.confirm('¿Estás seguro de que quieres volver? Se perderán los cambios no guardados.')) {
              navigate('/forum');
            }
          }}
        >
          ← Volver
        </button>
      </div>
      <div className="thread-create-content">
        <ThreadEditForm threadId={id} onCancel={() => navigate('/foro')} />
      </div>
    </div>
  );
};

export default ThreadEditPage;
