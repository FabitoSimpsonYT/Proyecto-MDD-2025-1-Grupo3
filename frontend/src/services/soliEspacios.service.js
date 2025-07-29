import axios from '@services/root.service.js'

export async function getSoliResidente(){
    try {
        console.log('Consultando URL:', `/soliEspacios/residente`);
        const response = await axios.get(`/soliEspacios/residente`);
        console.log('Respuesta del backend:', response.data);
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener solicitudes:", error);
    }
}

export async function deleteSoli(idSolicitud) {
    try {
        console.log('Consultando URL:', `/soliEspacios/${idSolicitud}`);
        const response = await axios.delete(`/soliEspacios/${idSolicitud}`);
        console.log('Respuesta del backend:', response.data);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar solicitud:", error);
    }
}

export async function updateSoli(idSolicitud, updatedValues) {
    try {
        console.log('Consultando URL:', `/soliEspacios/${idSolicitud}`);
        const response = await axios.put(`/soliEspacios/${idSolicitud}`, updatedValues);
        console.log('Respuesta del backend:', response.data);
        return response.data; 
    } catch (error) {
        console.error("Error al actualizar solicitud:", error);
        return null; 
    }
}

export async function createSoli(solicitud) {
    try {
        console.log('Consultando URL:', `/soliEspacios`);
        const response = await axios.post(`/soliEspacios`, solicitud);
        console.log('Respuesta del backend:', response.data);
        return response.data;
    } catch (error) {
        console.error("Error al crear solicitud:", error);
    }
}