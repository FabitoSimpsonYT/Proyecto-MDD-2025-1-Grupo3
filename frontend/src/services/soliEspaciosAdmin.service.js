import axios from './root.service.js';


export async function GetAllSoli() {
    try {
        const response = await axios.get('/soliEspacios/');
        return response.data.data;
    } catch (error) {
        console.error('Error al obtener solicitudes:', error);
    }
}

export async function updateSoliRes(idSolicitud, updatedValues) {
    try {
        const response = await axios.put(`/soliEspacios/updateRes/${idSolicitud}`, updatedValues);
        return response;
    } catch (error) {
        if (error.response) {
            return error.response;
        }
        throw error;
    }
}

export async function getOneSoli(idSolicitud) {
    try {
        const response = await axios.get(`/soliEspacios/admin/${idSolicitud}`);
        return response.data;
    } catch (error) {
        if (error.response) return error.response;
        throw error;
    }
}