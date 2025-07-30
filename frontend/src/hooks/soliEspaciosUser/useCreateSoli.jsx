import Swal from 'sweetalert2';
import { createSoli } from '@services/soliEspacios.service';
import { getEspacios } from '@services/espacios.service';

export async function createSoliAlert() {
    
    const espaciosResp = await getEspacios();
    const espacios = Array.isArray(espaciosResp?.data) ? espaciosResp.data : [];
    const opciones = espacios
        .map(e =>
            `<option value="${e.id}">${e.nombreEspacio}</option>`
        ).join('');

    const { value: formValues } = await Swal.fire({
        title: "Crear Solicitud de Espacio Común",
        html: `
            <div>
                <label for="swal2-select-espacio">Espacio</label>
                <select id="swal2-select-espacio" class="swal2-input">${opciones}</select>
            </div>
            <div>
                <label for="swal2-input2">Descripción</label>
                <textarea id="swal2-input2" class="swal2-textarea" placeholder="Descripción de la solicitud"></textarea>
            </div>
            <div>
                <label for="swal2-input3">Fecha Inicio</label>
                <input id="swal2-input3" type="date" class="swal2-input">
            </div>
            <div>
                <label for="swal2-input4">Fecha Fin</label>
                <input id="swal2-input4" type="date" class="swal2-input">
            </div>
            <div>
                <label for="swal2-input5">Hora Inicio (HH:MM)</label>
                <input id="swal2-input5" type="text" class="swal2-input" placeholder="Ej: 09:00">
            </div>
            <div>
                <label for="swal2-input6">Hora Fin (HH:MM)</label>
                <input id="swal2-input6" type="text" class="swal2-input" placeholder="Ej: 10:30">
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Crear",
        preConfirm: () => {
            const idEspacioSol = document.getElementById("swal2-select-espacio").value;
            const descripcion = document.getElementById("swal2-input2").value;
            const fechaInicio = document.getElementById("swal2-input3").value;
            const fechaFin = document.getElementById("swal2-input4").value;
            const horaInicio = document.getElementById("swal2-input5").value;
            const horaFin = document.getElementById("swal2-input6").value;

            
            if (!idEspacioSol || !descripcion || !fechaInicio || !fechaFin || !horaInicio || !horaFin) {
                Swal.showValidationMessage("Por favor, completa todos los campos");
                return false;
            }
            
            const hoy = new Date();
            hoy.setHours(0,0,0,0);
            const fechaInicioDate = new Date(fechaInicio);
            const fechaFinDate = new Date(fechaFin);
            if (fechaInicioDate <= hoy) {
                Swal.showValidationMessage("La solicitud debe hacerse al menos con un día de anticipación");
                return false;
            }
            if (fechaFinDate <= hoy) {
                Swal.showValidationMessage("La solicitud debe hacerse al menos con un día de anticipación");
                return false;
            }
            if (descripcion.length < 50) {
                Swal.showValidationMessage("La descripción debe tener al menos 50 caracteres.");
                return false;
            }
            const horaRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
            if (!horaRegex.test(horaInicio) || !horaRegex.test(horaFin)) {
                Swal.showValidationMessage("Las horas deben tener el formato HH:MM (24 horas).");
                return false;
            }
            return { idEspacioSol: Number(idEspacioSol), descripcion, fechaInicio, fechaFin, horaInicio, horaFin };
        },
    });
    if (formValues) {
        return formValues;
    }
}

export const useCreateSoli = (fetchSoliResidente) => {
    const handleCreateSoli = async () => {
        try {
            const newValues = await createSoliAlert();
            if (newValues) {
                await createSoli(newValues);
                fetchSoliResidente();
            }
        } catch (error) {
            console.error("Error al crear la solicitud:", error);
            await Swal.fire({
                title: "Error",
                text: "No se pudo crear la solicitud. Inténtalo de nuevo.",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        }
    };

    return { handleCreateSoli };
}