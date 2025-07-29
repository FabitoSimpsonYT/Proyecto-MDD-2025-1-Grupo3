import { useEffect, useState } from "react";
import { obtenerPublicaciones, actualizarEstado } from "../services/publicaciones.service";
import "@styles/publicaciones.css";

const VerPublicaciones = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [estadoForm, setEstadoForm] = useState({});
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const datosUsuario = JSON.parse(sessionStorage.getItem("usuario"));
    setUsuario(datosUsuario || null);
    cargarPublicaciones();
  }, []);

  const cargarPublicaciones = async () => {
    try {
      const datos = await obtenerPublicaciones();
      setPublicaciones(datos);
    } catch (error) {
      console.error("Error al cargar publicaciones:", error);
    }
  };

  const handleEstadoChange = (id, campo, valor) => {
    setEstadoForm((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [campo]: valor,
      },
    }));
  };

  const handleActualizarEstado = async (id) => {
    const data = estadoForm[id] || {};
    const { estado, comentario } = data;

    if (!estado) {
      alert("Selecciona un estado");
      return;
    }

    if (estado === "denegada" && (!comentario || comentario.trim() === "")) {
      alert("El comentario es obligatorio si el estado es 'denegada'.");
      return;
    }

    try {
      await actualizarEstado(id, {
        estado,
        comentario: comentario || "",
      });
      alert("Estado actualizado correctamente");
      setEstadoForm((prev) => ({ ...prev, [id]: {} }));
      cargarPublicaciones();
    } catch (error) {
      alert("Error al actualizar estado: " + (error.message || "Desconocido"));
    }
  };

  const esAdmin = usuario?.rol === "administrador";

  return (
    <div className="publicaciones-container">
      <h1>Publicaciones</h1>
      {publicaciones.length === 0 ? (
        <p>No hay publicaciones aún.</p>
      ) : (
        publicaciones.map((pub) => {
          const formData = estadoForm[pub.id] || {};
          return (
            <div key={pub.id} className="publicacion-card">
              <h3>{pub.titulo}</h3>
              <p><strong>Categoría:</strong> {pub.categoria}</p>
              <p><strong>Contenido:</strong> {pub.contenido}</p>
              <p><strong>Estado actual:</strong> {pub.estado || "pendiente"}</p>
              <p><strong>Comentario admin:</strong> {pub.comentario || "Ninguno"}</p>

              {esAdmin && (
                <div className="estado-form">
                  <label>Cambiar estado:</label>
                  <select
                    value={formData.estado || ""}
                    onChange={(e) =>
                      handleEstadoChange(pub.id, "estado", e.target.value)
                    }
                  >
                    <option value="">-- Seleccionar --</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="revisada">Revisada</option>
                    <option value="denegada">Denegada</option>
                  </select>

                  {(formData.estado === "revisada" || formData.estado === "denegada") && (
                    <textarea
                      placeholder="Comentario del admin"
                      value={formData.comentario || ""}
                      onChange={(e) =>
                        handleEstadoChange(pub.id, "comentario", e.target.value)
                      }
                    />
                  )}

                  <button
                    className="btn-guardar-estado"
                    onClick={() => handleActualizarEstado(pub.id)}
                      >
                        Guardar estado
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default VerPublicaciones;

