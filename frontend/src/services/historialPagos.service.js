import axios from './root.service.js';

export const getHistorialPagosPorCuenta = async (cuentaId) => {
  const response = await axios.get(`/pagos/historial/${cuentaId}`);
  return response.data;
};
