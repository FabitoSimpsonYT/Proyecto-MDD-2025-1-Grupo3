import Swal from 'sweetalert2';
import { updateSoli } from '@services/soliEspacios.service';
import { getEspacios } from '@services/espacios.service'; 

export async function editSoliAlert(solicitud) {
  
  const espaciosResp = await getEspacios();
  const espacios = Array.isArray(espaciosResp?.data) ? espaciosResp.data : [];
  
  const opciones = espacios
    .map(e =>
      `<option value="${e.id}" ${e.id === solicitud.idEspacioSol ? 'selected' : ''}>${e.nombreEspacio}</option>`
    ).join('');

  
  const horaInicioDefault = solicitud.horaInicio ? solicitud.horaInicio.slice(0,5) : '';
  const horaFinDefault = solicitud.horaFin ? solicitud.horaFin.slice(0,5) : '';
  const { value: formValues } = await Swal.fire({
    title: "Editar Solicitud",
    html: `
      <div>
        <label for="swal2-select-espacio">Espacio</label>
        <select id="swal2-select-espacio" class="swal2-input">${opciones}</select>
      </div>
      <div>
        <label for="swal2-input2">Descripción</label>
        <textarea id="swal2-input2" class="swal2-textarea" placeholder="Descripción">${solicitud.descripcion || ''}</textarea>
      </div>
      <div>
        <label for="swal2-input3">Fecha Inicio</label>
        <input id="swal2-input3" type="date" class="swal2-input" value="${solicitud.fechaInicio ? new Date(solicitud.fechaInicio).toISOString().split('T')[0] : ''}">
      </div>
      <div>
        <label for="swal2-input4">Fecha Fin</label>
        <input id="swal2-input4" type="date" class="swal2-input" value="${solicitud.fechaFin ? new Date(solicitud.fechaFin).toISOString().split('T')[0] : ''}">
      </div>
      <div>
        <label for="swal2-input5">Hora Inicio (HH:MM)</label>
        <input id="swal2-input5" type="text" class="swal2-input" placeholder="Ej: 09:00" value="${horaInicioDefault}">
      </div>
      <div>
        <label for="swal2-input6">Hora Fin (HH:MM)</label>
        <input id="swal2-input6" type="text" class="swal2-input" placeholder="Ej: 10:30" value="${horaFinDefault}">
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Editar",
    preConfirm: () => {
      const idEspacioSol = document.getElementById("swal2-select-espacio").value;
      const descripcion = document.getElementById("swal2-input2").value;
      const fechaInicio = document.getElementById("swal2-input3").value;
      const fechaFin = document.getElementById("swal2-input4").value;
      let horaInicio = document.getElementById("swal2-input5").value;
      let horaFin = document.getElementById("swal2-input6").value;

      
      if (!horaInicio) horaInicio = solicitud.horaInicio;
      if (!horaFin) horaFin = solicitud.horaFin;

      return {
        idEspacioSol: idEspacioSol !== "" ? Number(idEspacioSol) : solicitud.idEspacioSol,
        descripcion: descripcion !== "" ? descripcion : solicitud.descripcion,
        fechaInicio: fechaInicio !== "" ? fechaInicio : solicitud.fechaInicio,
        fechaFin: fechaFin !== "" ? fechaFin : solicitud.fechaFin,
        horaInicio,
        horaFin,
      };
    },
  });
  if (formValues) {
    return formValues;
  }
}

export const useUpdateSoli = (fetchSoliResidente) => {
  const handleUpdateSoli = async (solicitud) => {
    
    if (solicitud.estado !== "Sin Respuesta") {
      await Swal.fire({
        title: "No permitido",
        text: "Solo se pueden editar solicitudes en estado 'Sin Respuesta'.",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
      return;
    }
    try {
      const updatedValues = await editSoliAlert(solicitud);
      if (updatedValues) {
        
        if (!updatedValues.descripcion || updatedValues.descripcion.length < 50) {
          await Swal.fire({
            title: "Error",
            text: "La descripción debe tener al menos 50 caracteres.",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
          return;
        }
        
        const hoy = new Date();
        hoy.setHours(0,0,0,0);
        const fechaInicioDate = new Date(updatedValues.fechaInicio);
        const fechaFinDate = new Date(updatedValues.fechaFin);
        if (fechaInicioDate <= hoy) {
          await Swal.fire({
            title: "Error",
            text: "La solicitud debe hacerse al menos con un día de anticipación",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
          return;
        }
        if (fechaFinDate <= hoy) {
          await Swal.fire({
            title: "Error",
            text: "La solicitud debe hacerse al menos con un día de anticipación",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
          return;
        }
        const horaRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
        if (
          typeof updatedValues.horaInicio !== "string" ||
          typeof updatedValues.horaFin !== "string" ||
          !horaRegex.test(updatedValues.horaInicio) ||
          !horaRegex.test(updatedValues.horaFin)
        ) {
          await Swal.fire({
            title: "Error",
            text: "Las horas deben tener el formato HH:MM (24 horas).",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
          return;
        }
        
        const payload = {
          idEspacioSol: Number(updatedValues.idEspacioSol),
          descripcion: updatedValues.descripcion,
          fechaInicio: updatedValues.fechaInicio,
          fechaFin: updatedValues.fechaFin,
          horaInicio: updatedValues.horaInicio,
          horaFin: updatedValues.horaFin,
        };
        const response = await updateSoli(solicitud.idSolicitud, payload);
        if (response) {
          await Swal.fire({
            title: "Solicitud actualizada",
            text: "La solicitud ha sido actualizada correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
          if (fetchSoliResidente) await fetchSoliResidente();
        } else {
          await Swal.fire({
            title: "Error",
            text: "No se pudo actualizar la solicitud. Verifica los datos ingresados.",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        }
      }
    } catch (error) {
      console.error("Error al actualizar solicitud:", error);
      await Swal.fire({
        title: "Error",
        text: "No se pudo actualizar la solicitud",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return { handleUpdateSoli };
};

export default useUpdateSoli;