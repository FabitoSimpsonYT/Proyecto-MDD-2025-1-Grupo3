import axios from './root.service.js';
const API_URL = '/cuentas';

export const getCuentas = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createCuenta = async (cuenta) => {
  const response = await axios.post(API_URL, cuenta);
  return response.data;
};

export const updateCuenta = async (id, cuenta) => {
  const response = await axios.put(`${API_URL}/${id}`, cuenta);
  return response.data;
};

export const deleteCuenta = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
