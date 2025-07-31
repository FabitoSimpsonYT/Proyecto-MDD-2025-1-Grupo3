import { useState } from "react";
import axios from "axios";
import cookies from 'js-cookie';
import Swal from 'sweetalert2';

// Configurar la URL base de axios
axios.defaults.baseURL = 'http://localhost:3000';

const useChangeRole = (onSuccess, navigate) => {
  // Obtener el token de las cookies
  const getAuthToken = () => cookies.get('jwt-auth');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChangeRole = async (userId, newRole) => {
    try {
      // Primero mostrar el diálogo de confirmación
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Vas a cambiar el rol de este usuario. Esta acción podría afectar sus permisos en el sistema.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#64B5F6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cambiar rol',
        cancelButtonText: 'Cancelar'
      });

      // Si el usuario cancela, navegar a la página de usuarios
      if (!result.isConfirmed) {
        if (navigate) navigate('/users');
        return;
      }

      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await axios.put(
        `/api/users/${userId}/role`,
        { role: newRole },
        { 
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.data === 1) {
        await Swal.fire({
          title: 'Rol actualizado',
          text: 'El rol del usuario ha sido actualizado exitosamente',
          icon: 'success',
          confirmButtonColor: '#64B5F6'
        });

        if (onSuccess) await onSuccess();
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error al cambiar el rol");
      console.error("Error al cambiar el rol:", error);
      
      // Mostrar mensaje de error solo si no fue cancelado por el usuario
      await Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || "Error al cambiar el rol",
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    } finally {
      setLoading(false);
    }
  };

  return { handleChangeRole, loading, error };
};

export default useChangeRole;
