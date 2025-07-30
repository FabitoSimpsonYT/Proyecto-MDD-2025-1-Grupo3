import axios from './root.service.js';

export async function crearPublicacion(data) {
  try {
    const response = await axios.post('/sugerencias', data);
    return response.data;
  } catch (error) {
    console.error("crearPublicacion error:", error);
    throw error.response?.data || error.message;
      }

}



export const obtenerPublicaciones = async () => {
  try {
    const res = await axios.get('/sugerencias'); // ← ✅ Usa esta ruta
    return res.data.data || res.data;
  } catch (error) {
    console.error("obtenerPublicaciones error:", error);
    throw error.response?.data || error.message;
  }
};



export async function obtenerPublicacionPorId(id) {
  try {
    const response = await axios.get(`/sugerencias/${id}`);
    return response.data.data; // si tu backend devuelve { message, data }
  } catch (error) {
    console.error("obtenerPublicacionPorId error:", error);
    throw error.response?.data || error.message;
  }
}



export async function obtenerPublicacionesPorCategoria(categoria) {
  const response = await axios.get(`/sugerencias/categoria/${categoria}`);
  return response.data.data;
}


export async function obtenerPublicacionesPorEstado(estado) {
  const response = await axios.get(`/sugerencias/estado/${estado}`);
  return response.data.data;
}



export async function actualizarPublicacion(id, datos) {
  try {
    console.log("🔍 Enviando datos:", datos);

    const response = await axios.put(`/sugerencias/${id}`, datos); // ← Asegúrate de que axios es el correcto

    return response.data;
  } catch (error) {
    console.error("Error actualizando publicación:", error);
    throw error.response?.data || error.message;
  }
}



export async function actualizarEstado(id, data) {
  try {
    const res = await axios.put(`/sugerencias/${id}/estado`, data);
    return res.data;
  } catch (error) {
    console.error("actualizarEstado error:", error);
    throw error.response?.data || error.message;
  }
}


export async function eliminarPublicacion(id) {
  try {
    const response = await axios.delete(`/sugerencias/${id}`);
    return response.data;
  } catch (error) {
    console.error("eliminarPublicacion error:", error);
    throw error.response?.data || error.message;
  }
}




export const obtenerMisPublicaciones = async () => {
  try {
    const response = await axios.get('/sugerencias/mis-publicaciones'); // ← baseURL ya incluye /api
    console.log("🔍 Datos obtenidos:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener mis publicaciones:", error.response?.data || error.message);
    throw error;
  }
};




