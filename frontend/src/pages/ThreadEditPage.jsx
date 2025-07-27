import { useParams, useNavigate } from 'react-router-dom';
import ThreadEditForm from '../components/ThreadEditForm';

const ThreadEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="thread-edit-page" style={{ maxWidth: 600, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #0001', padding: '2rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Editar hilo</h2>
      <ThreadEditForm threadId={id} onCancel={() => navigate('/foro')} />
    </div>
  );
};

export default ThreadEditPage;
