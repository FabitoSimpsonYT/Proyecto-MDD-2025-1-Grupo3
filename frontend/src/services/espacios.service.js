import axios from '@services/root.service.js';

export async function getEspacios(){
    try {
        const response = await axios.get('/espaciosComunes/')
        return response.data;
    } catch (error) {
        console.error("Error al obtener los espacios: ", error)
    }
}

export async function getEspacioById(espacioId) {
    try {
        const response = await axios.get(`/espaciosComunes/${espacioId}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener el espacio por ID: ", error);
    }
}

export async function createEspacio(espacioData) {
    try {
        const response = await axios.post('/espaciosComunes/', espacioData);
        return response.data;
    } catch (error) {
        console.error("Error al crear el espacio: ", error);
    }
}

export async function updateEspacio(espacioId, espacioData) {
    try {
        const response = await axios.put(`/espaciosComunes/${espacioId}`, espacioData);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el espacio: ", error);
    }
}

export async function deleteEspacio(espacioId) {
    try {
        const response = await axios.delete(`/espaciosComunes/${espacioId}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el espacio: ", error);
    }
}   