import Swal from 'sweetalert2';
import { createEspacio } from '@services/espacios.service.js';

export async function createEspacioAlert() {
  const { value: formValues } = await Swal.fire({
    title: "Crear Espacio Común",
    html: `
      <div>
        <label for="swal2-input1">Espacio</label>
        <input id="swal2-input1" class="swal2-input" placeholder="Nombre del espacio">
      </div>
      <div>
        <label for="swal2-input2">Dirección</label>
        <input id="swal2-input2" class="swal2-input" placeholder="Dirección">
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Crear",
    preConfirm: () => {
      const nombreEspacio = document.getElementById("swal2-input1").value;
      const direccionEspacio = document.getElementById("swal2-input2").value;

      if (!nombreEspacio || !direccionEspacio) {
        Swal.showValidationMessage("Por favor, completa todos los campos");
        return false;
      }
      if (nombreEspacio.length < 3) {
        Swal.showValidationMessage("El nombre debe tener al menos 3 caracteres.");
        return false;
      }
      if (nombreEspacio.length > 50) {
        Swal.showValidationMessage("El nombre no puede exceder los 50 caracteres.");
        return false;
      }
      if (!/^[a-zA-Z0-9\s]+$/.test(nombreEspacio)) {
        Swal.showValidationMessage("El nombre solo puede contener letras, números y espacios.");
        return false;
      }
      if (direccionEspacio.length < 3) {
        Swal.showValidationMessage("La dirección debe tener al menos 3 caracteres.");
        return false;
      }
      if (direccionEspacio.length > 100) {
        Swal.showValidationMessage("La dirección no puede exceder los 100 caracteres.");
        return false;
      }
      if (!/^[a-zA-Z0-9\s,.-]+$/.test(direccionEspacio)) {
        Swal.showValidationMessage("La dirección solo puede contener letras, números, espacios, comas, puntos y guiones.");
        return false;
      }
      return { nombreEspacio, direccionEspacio };
    },
  });
  if (formValues) {
    return {
      nombreEspacio: formValues.nombreEspacio,
      direccionEspacio: formValues.direccionEspacio,
    };
  }
}


export const useCreateEspacio = (fetchEspacios) => {
    const HandleCreateEspacio = async () => {
        try {
            const formValues = await createEspacioAlert();
            if (!formValues) return;

            const response = await createEspacio(formValues);
            if (response) {
                await fetchEspacios();
            }
        } catch (error) {
            console.log("Error al crear el espacio común:", error);
        }
    }

    return { HandleCreateEspacio };
}

export default useCreateEspacio;