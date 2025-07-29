import Swal from 'sweetalert2';
import { updateSoliRes } from '@services/soliEspaciosAdmin.service.js';

export async function responseSoliAlert(solicitud) {
  const { value: formValues } = await Swal.fire({
    title: "Responder Solicitud",
    html: `
      <div>
        <label for="swal2-select-estado">Estado</label>
        <select id="swal2-select-estado" class="swal2-input">
          <option value="Aprobado" ${solicitud.estado === "Aprobado" ? "selected" : ""}>Aprobado</option>
          <option value="Rechazado" ${solicitud.estado === "Rechazado" ? "selected" : ""}>Rechazado</option>
          <option value="Sin Respuesta" ${solicitud.estado === "Sin Respuesta" ? "selected" : ""}>Sin Respuesta</option>
        </select>
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
          <span style="font-weight: bold;">Observaciones</span>
          <textarea id="swal2-input-observaciones" class="swal2-textarea" placeholder="Observaciones" style="flex:1;"></textarea>
        </div>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Responder",
    preConfirm: () => {
      const estado = document.getElementById("swal2-select-estado").value;
      const observaciones = document.getElementById("swal2-input-observaciones").value;
      return { estado, observaciones };
    },
  });
  if (formValues) {
    return formValues;
  }
}

export const useUpdateSoliRes = (fetchSoli) => {
  const handleUpdateSoliRes = async (solicitud) => {
    try {
      const updatedValues = await responseSoliAlert(solicitud);
      if (!updatedValues) return;

      if (
        updatedValues.estado === "Rechazado" &&
        (!updatedValues.observaciones || updatedValues.observaciones.trim() === "" || updatedValues.observaciones.trim() === "Sin observaciones")
      ) {
        await Swal.fire({
          title: "Error",
          text: "Debe ingresar observaciones cuando el estado es 'Rechazado'.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
        return;
      }

      const estadosValidos = ["Aprobado", "Rechazado", "Sin Respuesta"];
      if (!estadosValidos.includes(updatedValues.estado)) {
        await Swal.fire({
          title: "Error",
          text: "Estado inválido.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
        return;
      }

      let payload = { estado: updatedValues.estado };

      if (
        updatedValues.observaciones &&
        updatedValues.observaciones.trim() !== ""
      ) {
        payload.observaciones = updatedValues.observaciones;
      } else if (updatedValues.estado === "Rechazado") {
        
        payload.observaciones = updatedValues.observaciones;
      }

      const response = await updateSoliRes(solicitud.idSolicitud, payload);

      if (response && response.status === 200) {
        await Swal.fire({
          title: "Solicitud respondida",
          text: "La solicitud ha sido respondida correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        if (fetchSoli) await fetchSoli();
      } else {
        await Swal.fire({
          title: "Error",
          text: response?.data?.message || "No se pudo responder la solicitud.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (error) {
      console.error("Error al responder solicitud:", error);
      await Swal.fire({
        title: "Error",
        text: "No se pudo responder la solicitud.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return { handleUpdateSoliRes };
};

export default useUpdateSoliRes;


