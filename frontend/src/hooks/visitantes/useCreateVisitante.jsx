import Swal from "sweetalert2";
import { CreateVisitante } from "@services/visitantes.service.js";

async function createVisitanteInfo() {
  const { value: formValues } = await Swal.fire({
    title: "Registrar Visitante",
    html: `
      <div>
        <label for="swal2-input1">-----Nombre-----</label>
        <input id="swal2-input1" class="swal2-input" placeholder="Nombre">
      </div>
      <div>
         <label for="swal2-input2">-----Edad-----</label>
         <input id="swal2-input2" class="swal2-input" placeholder="Edad">
      </div>
      <div>
        <label for="swal2-input3">-----Número de casa-----</label>
        <input id="swal2-input3" class="swal2-input" placeholder="Número de casa">
      </div>
      <div>
        <label for="swal2-input4">-----Correo electrónico-----</label>
        <input id="swal2-input4" class="swal2-input" placeholder="Correo electrónico">
      </div>
      <div>
        <label for="swal2-input5">-----Descripción-----</label>
        <input id="swal2-input5" class="swal2-input" placeholder="Descripción">
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Registrar",
    preConfirm: () => {
      const nombre = document.getElementById("swal2-input1").value.trim();
      const edad = document.getElementById("swal2-input2").value.trim();
      const numerocasa = document.getElementById("swal2-input3").value.trim();
      const email = document.getElementById("swal2-input4").value.trim();
      const descripcion = document.getElementById("swal2-input5").value.trim();

      if (!nombre || !edad || !numerocasa || !email || !descripcion) {
        Swal.showValidationMessage("Todos los campos son obligatorios");
        return false;
      }

      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
        Swal.showValidationMessage("El nombre solo debe tener letras y espacios");
        return false;
      }
      if (nombre.length < 3 || nombre.length > 50) {
        Swal.showValidationMessage("El nombre debe tener entre 3 y 50 caracteres");
        return false;
      }

      if (isNaN(edad) || parseInt(edad) < 18 || parseInt(edad) > 110) {
        Swal.showValidationMessage("La edad debe ser un número entre 18 y 110");
        return false;
      }

      if (!/^[a-zA-Z0-9\s]+$/.test(numerocasa)) {
        Swal.showValidationMessage("El número de casa solo debe contener letras y números");
        return false;
      }
      if (numerocasa.length < 1 || numerocasa.length > 20) {
        Swal.showValidationMessage("El número de casa debe tener entre 1 y 20 caracteres");
        return false;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        Swal.showValidationMessage("Correo electrónico inválido");
        return false;
      }
      if (email.length < 10 || email.length > 50) {
        Swal.showValidationMessage("El correo electrónico debe tener entre 10 y 50 caracteres");
        return false;
      }

      if (descripcion.length < 10 || descripcion.length > 200) {
        Swal.showValidationMessage("La descripción debe tener entre 10 y 200 caracteres");
        return false;
      }
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,!?¡¿'"()-]+$/.test(descripcion)) {
        Swal.showValidationMessage("La descripción contiene caracteres inválidos");
        return false;
      }

      return {
        nombre,
        edad: parseInt(edad),
        numerocasa,
        email,
        descripcion,
      };
    },
  });

  return formValues;
}

export const useCreateVisitante = (fetchVisitantes) => {
  const handleCreateVisitante = async () => {
    try {
      const formValues = await createVisitanteInfo();
      if (!formValues) return;
      console.log("Datos a enviar:", formValues);
      const response = await CreateVisitante(formValues);
      if (response) {
        await fetchVisitantes();
        Swal.fire("¡Registrado!", "El visitante fue creado correctamente.", "success");
      }
    } catch (error) {
      console.error("Error al crear visitante:", error);
      
      // Manejar específicamente el error 403 (límite de visitantes)
      if (error.response && error.response.status === 403) {
        Swal.fire({
          icon: "warning",
          title: "Límite alcanzado",
          text: "Solo se pueden registrar hasta 2 visitantes por día. Por favor, intenta nuevamente mañana.",
          confirmButtonColor: "#3085d6"
        });
      } else {
        // Para otros tipos de errores
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "No se pudo crear el visitante",
          confirmButtonColor: "#3085d6"
        });
      }
    }
  };

  return { handleCreateVisitante };
};

export default useCreateVisitante;
