import axios from '@services/root.service.js'

export async function getSoliResidente(){
    try {
        const response = await axios.get(`/soliEspacios/residente`);
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener solicitudes:", error);
    }
}

export async function deleteSoli(idSolicitud) {
    try {
        const response = await axios.delete(`/soliEspacios/${idSolicitud}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar solicitud:", error);
    }
}

export async function updateSoli(idSolicitud, updatedValues) {
    try {
        const response = await axios.put(`/soliEspacios/${idSolicitud}`, updatedValues);
        return response.data; 
    } catch (error) {
        console.error("Error al actualizar solicitud:", error);
        return null; 
    }
}

export async function createSoli(solicitud) {
    try {
        const response = await axios.post(`/soliEspacios`, solicitud);
        return response.data;
    } catch (error) {
        console.error("Error al crear solicitud:", error);
    }
}
