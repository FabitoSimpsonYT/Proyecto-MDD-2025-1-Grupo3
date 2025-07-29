import axios from './root.service.js';

export const getThreads = async () => {
  try {
    const response = await axios.get('/threads');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al obtener los hilos' };
  }
};

export const createThread = async (threadData) => {
  try {
    const response = await axios.post('/threads/create', threadData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al crear el hilo' };
  }
};

export const updateThread = async (id, threadData) => {
  try {
    const response = await axios.put(`/threads/${id}`, threadData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al actualizar el hilo' };
  }
};