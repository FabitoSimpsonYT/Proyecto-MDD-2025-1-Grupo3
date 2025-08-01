import { DeleteVisitante } from "@services/visitantes.service.js";
import Swal from "sweetalert2";

async function confirmarDeleteVisitante() {
 const result = await Swal.fire({
    title: "¿Estas seguro?",
    text: "No podras deshacer esta accion",
    icon: "warning",
    howCancelButton: true,
    confirmButtonText: "Si, Denegar",
    });
    return result.isConfirmed;
}



export const useDeleteVisitante = (fetchVisitantes) => {
    const handleDeleteVisitante = async (visitanteId) =>{
        try {
              const isConfirmed = await confirmarDeleteVisitante();
              if(isConfirmed) { 
               const response = await DeleteVisitante(visitanteId);
                if (response){
                  Swal.fire({
                    title: "Denegar visitante",
                    text: "el visitante a sido Denegado exitosamente",
                    icon: "success",
                    confirmButtonText:"Aceptar"
                   });
                 await fetchVisitantes();
                }
            } 

        } catch (error) {
            console.error("error al Denegar al visitante",error);
            
        }
    }
    return { handleDeleteVisitante };
}
export default useDeleteVisitante;