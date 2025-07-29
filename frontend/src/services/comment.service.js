import axios from './root.service';

export async function getCommentsByThread(threadId) {
  const res = await axios.get(`/comments/${threadId}`);
  return res.data;
}

export async function createComment({ contenido, threadId }) {
  const res = await axios.post('/comments/create', { contenido, threadId });
  return res.data;
}

export async function updateComment(commentId, contenido) {
  const res = await axios.put(`/comments/${commentId}`, { contenido });
  return res.data;
}

export async function deleteComment(commentId) {
  const res = await axios.delete(`/comments/${commentId}`);
  return res.data;
}
