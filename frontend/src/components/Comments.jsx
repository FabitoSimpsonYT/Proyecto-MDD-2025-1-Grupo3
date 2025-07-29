import React, { useEffect, useState } from 'react';
import { getCommentsByThread, createComment, updateComment, deleteComment } from '../services/comment.service';
import '../styles/comments.css';
const usuario = JSON.parse(sessionStorage.getItem('usuario'));
const usuarioId = usuario?.id;
const esAdmin = usuario?.rol === 'administrador';
import { getPublicUsers } from '../services/user.service';


const Comments = ({ threadId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contenido, setContenido] = useState('');
  const [posting, setPosting] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editContenido, setEditContenido] = useState('');
  const [editLoading, setEditLoading] = useState(false);


  useEffect(() => {
    fetchComments();
    fetchUsuarios();
  }, [threadId]);

  const fetchUsuarios = async () => {
    try {
      const data = await getPublicUsers();
      setUsuarios(data || []);
    } catch (err) {
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

  const handleEdit = (comment) => {
    setEditId(comment.id);
    setEditContenido(comment.contenido);
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditContenido('');
  };

  const handleEditSave = async (commentId) => {
    if (!editContenido.trim()) return;
    setEditLoading(true);
    try {
      await updateComment(commentId, editContenido);
      setEditId(null);
      setEditContenido('');
      fetchComments();
    } catch (err) {
      setError('No se pudo editar el comentario');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('¿Seguro que deseas eliminar este comentario?')) return;
    setEditLoading(true);
    try {
      await deleteComment(commentId);
      fetchComments();
    } catch (err) {
      setError('No se pudo eliminar el comentario');
    } finally {
      setEditLoading(false);
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
        <ul className="comments-list" style={{ maxHeight: 210, overflowY: 'auto', paddingRight: 8, marginBottom: 0 }}>
          {comments.length === 0 ? (
            <li>No hay comentarios aún.</li>
          ) : (
            comments.map(comment => (
              <li key={comment.id} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <b>{getUsername(comment.creadoPor)}</b>:
                  {(esAdmin || String(comment.creadoPor) === String(usuarioId)) && editId !== comment.id && (
                    <>
                      <button
                        onClick={() => handleEdit(comment)}
                        title="Editar"
                        className="comment-action-btn comment-edit-btn"
                      >
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14.7 2.29a1 1 0 0 1 1.42 0l1.59 1.59a1 1 0 0 1 0 1.42l-9.3 9.3-2.12.71a1 1 0 0 1-1.27-1.27l.71-2.12 9.3-9.3zM3 17a1 1 0 0 0 1 1h12a1 1 0 1 0 0-2H5a1 1 0 0 0-1 1z" fill="currentColor"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        title="Eliminar"
                        className="comment-action-btn comment-delete-btn"
                      >
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 7a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1zm4 1a1 1 0 0 0-2 0v6a1 1 0 1 0 2 0V8zm3-3V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v1H4a1 1 0 1 0 0 2h12a1 1 0 1 0 0-2h-1zm-2-1v1h-2V4h2zm-7 3v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H5z" fill="currentColor"/>
                        </svg>
                      </button>
                    </>
                  )}
                </div>
                {editId === comment.id ? (
                  <div style={{ marginTop: 4 }}>
                    <textarea
                      value={editContenido}
                      onChange={e => setEditContenido(e.target.value)}
                      rows={2}
                      style={{ width: '100%', borderRadius: 6, padding: 6, border: '1px solid #ccc', resize: 'vertical' }}
                    />
                    <div style={{ marginTop: 4 }}>
                      <button onClick={() => handleEditSave(comment.id)} disabled={editLoading || !editContenido.trim()} style={{ marginRight: 6 }}>
                        {editLoading ? 'Guardando...' : 'Guardar'}
                      </button>
                      <button onClick={handleEditCancel} disabled={editLoading}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <div>{comment.contenido}</div>
                )}
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
