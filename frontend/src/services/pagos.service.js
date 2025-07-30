
import axios from './root.service.js';
const API_URL = '/pagos';

export const rechazarPago = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}/rechazar`, data);
  return response.data;
};

export const getPagos = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createPago = async (pago, voucherFile) => {
  const formData = new FormData();
  Object.entries(pago).forEach(([key, value]) => {
    formData.append(key, value);
  });
  if (voucherFile) {
    formData.append('voucher', voucherFile);
  }
  const response = await axios.post(API_URL, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const confirmarPago = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}/confirmar`, data);
  return response.data;
};
