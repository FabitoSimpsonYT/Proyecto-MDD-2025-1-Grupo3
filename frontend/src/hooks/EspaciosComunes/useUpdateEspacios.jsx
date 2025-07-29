import { updateEspacio } from "../../services/espacios.service.js";
import Swal from "sweetalert2";

export async function editEspacioAlert(espacio) {
  const { value: formValues } = await Swal.fire({
    title: "Editar Espacio Común",
    html: `
      <div>
        <label for="swal2-input1">Espacio</label>
        <input id="swal2-input1" class="swal2-input" placeholder="Nombre del espacio" value="${espacio.nombreEspacio}">
      </div>
      <div>
        <label for="swal2-input2">Dirección</label>
        <input id="swal2-input2" class="swal2-input" placeholder="Dirección" value="${espacio.direccionEspacio}">
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Editar",
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

export const useUpdateEspacios = (fetchEspacios) => {
    const HandleUpdateEspacio = async (espacioId, espacioData) => {
        try {
            const { formValues } = await editEspacioAlert(espacioData);
            if (formValues) {
                const response = await updateEspacio(espacioId, formValues);
                if (response) {
                    await fetchEspacios();
                }
            }    
        } catch (error) {
            console.error("Error al actualizar el espacio:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo actualizar el espacio. Inténtalo de nuevo.",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        }
    }

    return { HandleUpdateEspacio };
}

export default useUpdateEspacios;