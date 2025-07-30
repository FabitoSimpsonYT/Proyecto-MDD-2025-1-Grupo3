import axios from '@services/root.service.js';

export async function GetVisitantes (){
   try {
    const response = await axios.get('/visitante/');
    return response.data.data;
   } catch (error) {
      console.error("error al Obtener a los visitantes");
     
   }
}

export async function DeleteVisitante(visitanteId) {
    try {
        const response = await axios.delete(`/visitante/${visitanteId}`)
        return response.data;
    } catch (error) {
        console.error("error al Elimiar al visitante")
    }
    
}
export async function Editvisitante(visitanteId, visitanteData) {
    try{
        const response = await axios.put(`/visitante/${visitanteId}`, visitanteData);
        return response.data;
    } catch (error) {
        console.error("Error al Editar a visitante", error);
    }
     
}
export async function CreateVisitante(visitanteData) {
    try {
        const response = await axios.post(`/visitante/`, visitanteData);
        return response.data
    } catch (error) {
        console.error("Error al Crear al visitante", error);
    }
    
}
