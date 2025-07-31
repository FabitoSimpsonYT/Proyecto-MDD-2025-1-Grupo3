import "@styles/users.css";
import useGetUsers from "@hooks/users/useGetUsers.jsx";
import useDeleteUser from "@hooks/users/useDeleteUser.jsx";
import useEditUser from "@hooks/users/useEditUser.jsx";
import useChangeRole from "@hooks/users/useChangeRole.jsx";
import { useEffect } from "react";
import Swal from 'sweetalert2';

const Users = () => {
  const { users, fetchUsers } = useGetUsers();
  const { handleDeleteUser } = useDeleteUser(fetchUsers);
  const { handleEditUser } = useEditUser(fetchUsers);
  const { handleChangeRole, loading } = useChangeRole(fetchUsers);

  const handleRoleChange = async (user) => {
    // Verificar si es el usuario Administrador
    if (user.username === "Administrador") {
      await Swal.fire({
        icon: 'warning',
        title: 'Acción no permitida',
        text: 'No se puede cambiar el rol del usuario administrador principal',
        confirmButtonColor: '#64B5F6'
      });
      return;
    }

    const { value: newRole } = await Swal.fire({
      title: `Cambiar rol de ${user.username}`,
      html: `<div class="role-select">
        <p>Rol actual: <strong>${user.role}</strong></p>
        <p>Selecciona el nuevo rol:</p>
      </div>`,
      input: 'select',
      inputOptions: {
        'usuario': 'Usuario',
        'administrador': 'Administrador'
      },
      inputValue: user.role,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Cambiar Rol',
      confirmButtonColor: '#64B5F6', // Azul más claro
      cancelButtonColor: '#dc3545',
      inputValidator: (value) => {
        if (!value) {
          return 'Debes seleccionar un rol';
        }
      }
    });

    if (newRole) {
      try {
        await handleChangeRole(user.id, newRole);
        fetchUsers(); // Actualizar la lista de usuarios
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Error al cambiar el rol',
          confirmButtonColor: '#dc3545'
        });
      }
    }
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="users-page">
      <h2>Lista de Usuarios</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="edit" onClick={() => handleEditUser(user.id, user)}>Editar</button>
                    <button className="delete" onClick={() => handleDeleteUser(user.id)}>Eliminar</button>
                    <button 
                      onClick={() => handleRoleChange(user)}
                      disabled={loading || user.username === "Administrador"}
                      title={user.username === "Administrador" ? "No se puede cambiar el rol del usuario administrador principal" : ""}
                      style={{
                        backgroundColor: '#64B5F6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '8px 12px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1,
                        transition: 'background-color 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#42A5F5'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#64B5F6'}
                    >
                      {loading ? 'Cambiando...' : 'Cambiar Rol'}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No hay usuarios disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
