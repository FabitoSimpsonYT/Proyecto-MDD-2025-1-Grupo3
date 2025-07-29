import { deleteEspacio } from "@services/espacios.service.js";
import Swal from "sweetalert2";

export const useDeleteEspacio = (fetchEspacios) => {
    const HandleDeleteEspacio = async (espacioId) => {
        const confirm = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción eliminará el espacio de forma permanente.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        });
        if (!confirm.isConfirmed) return;
        try {
            const response = await deleteEspacio(espacioId);
            if (response) {
                Swal.fire({
                    title: "Eliminado!",
                    text: "El espacio ha sido eliminado correctamente.",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                });
                await fetchEspacios();
            }
        } catch (error) {
            console.error("Error al eliminar el espacio:", error);  
        }
    }
    return { HandleDeleteEspacio };
}

export default useDeleteEspacio;