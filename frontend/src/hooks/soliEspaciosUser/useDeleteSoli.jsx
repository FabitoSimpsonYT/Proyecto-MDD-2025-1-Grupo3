import Swal from 'sweetalert2';
import { deleteSoli } from '@services/soliEspacios.service';

async function confirmDeleteSoli() {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "No podrás deshacer esta acción",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });
  return result.isConfirmed;
}

async function confirmAlert() {
  await Swal.fire({
    title: "Solicitud eliminada",
    text: "La solicitud ha sido eliminada correctamente",
    icon: "success",
    confirmButtonText: "Aceptar",
  });
}

async function confirmError() {
  await Swal.fire({
    title: "Error",
    text: "No se pudo eliminar la solicitud",
    icon: "error",
    confirmButtonText: "Aceptar",
  });
}

export const useDeleteSoli = (fetchSoliResidente, onSuccess) => {
  const handleDeleteSoli = async (idSolicitud, estado) => {
    
    if (estado !== "Sin Respuesta") {
      await Swal.fire({
        title: "No permitido",
        text: "Solo se pueden eliminar solicitudes en estado 'Sin Respuesta'.",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
      return;
    }
    try {
      const isConfirmed = await confirmDeleteSoli();
      if (isConfirmed) {
        const response = await deleteSoli(idSolicitud);
        if (response) {
          await confirmAlert();
          if (fetchSoliResidente) await fetchSoliResidente();
          if (onSuccess) onSuccess();
        }
      }
    } catch (error) {
      console.error("Error al eliminar solicitud:", error);
      await confirmError();
    }
  };

  return { handleDeleteSoli };
}

export default useDeleteSoli;