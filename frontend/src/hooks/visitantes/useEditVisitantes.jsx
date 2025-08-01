import Swal from "sweetalert2";
import { Editvisitante } from "@services/visitantes.service";

async function editVisitanteInfo(visitante) {
  const { value: formValues } = await Swal.fire({
    title: "actualizar al Visitante",
    html: `
      <div>
        <label for="swal2-input1">------Nombre------</label>  
        <input id="swal2-input1" class="swal2-input" placeholder="Nombre" value="${visitante.nombre || ''}">
      </div>
      <div>
        <label for="swal2-input2">------Edad------</label>  
        <input id="swal2-input2" class="swal2-input" placeholder="Edad" value="${visitante.edad || ''}">
      </div>
      <div>
        <label for="swal2-input3">------Número de casa------</label>
        <input id="swal2-input3" class="swal2-input" placeholder="Número de casa" value="${visitante.numerocasa || ''}">
      </div>
      <div>
        <label for="swal2-input4">------Correo Electrónico------</label>
        <input id="swal2-input4" class="swal2-input" placeholder="Correo Electrónico" value="${visitante.correo || ''}">
      </div>
      <div>
        <label for="swal2-input5">------Descripción------</label>
        <input id="swal2-input5" class="swal2-input" placeholder="Descripción" value="${visitante.descripcion || ''}">
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Editar",
    preConfirm: () => {
      const nombre = document.getElementById("swal2-input1").value.trim();
      const edad = document.getElementById("swal2-input2").value.trim();
      const numerocasa = document.getElementById("swal2-input3").value.trim();
      const correo = document.getElementById("swal2-input4").value.trim();
      const descripcion = document.getElementById("swal2-input5").value.trim();

      if (!nombre || !edad || !numerocasa || !correo || !descripcion) {
        Swal.showValidationMessage("Por favor, completa todos los campos");
        return false;
      }

      if (isNaN(edad)) {
        Swal.showValidationMessage("La edad debe ser un número");
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correo)) {
        Swal.showValidationMessage("Por favor, ingresa un correo electrónico válido");
        return false;
      }

      return {
        nombre,
        edad: parseInt(edad),
        numerocasa,
        correo,
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
      console.error("Error al actualizar al visitante:", error);
    }
  };

  return { handleEditVisitante };
};

export default useEditVisitantes;
