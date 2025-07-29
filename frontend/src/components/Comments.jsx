import React, { useEffect, useState } from 'react';
import { getCommentsByThread, createComment } from '../services/comment.service';
import { getPublicUsers } from '../services/user.service';


const Comments = ({ threadId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contenido, setContenido] = useState('');
  const [posting, setPosting] = useState(false);
  const [usuarios, setUsuarios] = useState([]);


  useEffect(() => {
    fetchComments();
    fetchUsuarios();
  }, [threadId]);

  const fetchUsuarios = async () => {
    try {
      const data = await getPublicUsers();
      setUsuarios(data || []);
    } catch (err) {
      // No es crítico para mostrar comentarios
    }
  };

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCommentsByThread(threadId);
      setComments(data);
    } catch (err) {
      setError('No se pudieron cargar los comentarios');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contenido.trim()) return;
    setPosting(true);
    try {
      await createComment({ contenido, threadId });
      setContenido('');
      fetchComments();
    } catch (err) {
      setError('No se pudo publicar el comentario');
    } finally {
      setPosting(false);
    }
  };


  const getUsername = (id) => {
    const user = usuarios.find(u => String(u.id) === String(id));
    return user ? user.username : id;
  };

  return (
    <div className="comments-section">
      <h3>Comentarios</h3>
      {loading ? (
        <div>Cargando comentarios...</div>
      ) : error ? (
        <div className="form-error">{error}</div>
      ) : (
        <ul className="comments-list">
          {comments.length === 0 ? (
            <li>No hay comentarios aún.</li>
          ) : (
            comments.map(comment => (
              <li key={comment.id}>
                <div><b>{getUsername(comment.creadoPor)}</b>:</div>
                <div>{comment.contenido}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{new Date(comment.createdAt).toLocaleString()}</div>
              </li>
            ))
          )}
        </ul>
      )}
      <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
        <textarea
          value={contenido}
          onChange={e => setContenido(e.target.value)}
          placeholder="Escribe un comentario..."
          rows={2}
          style={{ width: '100%', borderRadius: 6, padding: 8, border: '1px solid #ccc', resize: 'vertical' }}
        />
        <button type="submit" disabled={posting || !contenido.trim()} className="btn-create-thread" style={{ marginTop: 8 }}>
          {posting ? 'Publicando...' : 'Comentar'}
        </button>
      </form>
    </div>
  );
};

export default Comments;
