import axios from './root.service.js';

export const getHistorialPagosUsuario = async () => {
  const response = await axios.get('/pagos/historial');
  return response.data;
};
