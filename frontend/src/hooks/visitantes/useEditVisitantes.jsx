import Swal from "sweetalert2";
import { Editvisitante } from "@services/visitantes.service";

async function editVisitanteInfo(visitante) {
  const { value: formValues } = await Swal.fire({
    title: "Editar Visitante",
    html: `
      <div>
        <label for="swal2-input1">------Edad------</label>  
        <input id="swal2-input1" class="swal2-input" placeholder="Edad" value="${visitante.edad || ''}">
      </div>
      <div>
        <label for="swal2-input2">------Número de casa------</label>
        <input id="swal2-input2" class="swal2-input" placeholder="Número de casa" value="${visitante.numerocasa || ''}">
      </div>
      <div>
        <label for="swal2-input3">------Descripción------</label>
        <input id="swal2-input3" class="swal2-input" placeholder="Descripción" value="${visitante.descripcion || ''}">
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Editar",
    preConfirm: () => {
      const edad = document.getElementById("swal2-input1").value.trim();
      const numerocasa = document.getElementById("swal2-input2").value.trim();
      const descripcion = document.getElementById("swal2-input3").value.trim();

      if (!edad || !numerocasa || !descripcion) {
        Swal.showValidationMessage("Por favor, completa todos los campos");
        return false;
      }

      if (isNaN(edad)) {
        Swal.showValidationMessage("La edad debe ser un número");
        return false;
      }

      return {
        edad: parseInt(edad),
        numerocasa,
        descripcion,
      };
    },
  });

  return formValues;
}

export const useEditVisitantes = (fetchVisitantes) => {
  const handleEditVisitante = async (visitanteId, visitante) => {
    try {
      const formValues = await editVisitanteInfo(visitante);
      if (!formValues) return;

      const response = await Editvisitante(visitanteId, formValues);
      if (response) {
        await fetchVisitantes();
      }
    } catch (error) {
      console.error("Error al editar al visitante:", error);
    }
  };

  return { handleEditVisitante };
};

export default useEditVisitantes;
