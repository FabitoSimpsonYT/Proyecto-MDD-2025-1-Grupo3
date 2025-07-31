import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  obtenerPublicaciones,
  actualizarEstado,
  obtenerPublicacionesPorCategoria,
  obtenerPublicacionesPorEstado,
} from "../services/publicaciones.service";
import "@styles/publicaciones.css";

const VerPublicaciones = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [estadoForm, setEstadoForm] = useState({});
  const [usuario, setUsuario] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const navigate = useNavigate(); // ✅ Inicializa navegación

  useEffect(() => {
    const datosUsuario = JSON.parse(sessionStorage.getItem("usuario"));
    
    // Si no hay usuario o no es admin, redirige
    if (!datosUsuario || datosUsuario.role !== "administrador") {
      navigate("/"); // Puedes redirigir a otra ruta si lo deseas
      return;
    }

    setUsuario(datosUsuario);
    cargarPublicaciones();
  }, [navigate]);

  const cargarPublicaciones = async () => {
    try {
      const datos = await obtenerPublicaciones();
      setPublicaciones(datos);
    } catch (error) {
      console.error("Error al cargar publicaciones:", error);
    }
  };

const aplicarFiltros = async () => {
  try {
    const todas = await obtenerPublicaciones(); // Trae todos los datos actualizados
    let filtradas = todas;

    if (filtroCategoria) {
      filtradas = filtradas.filter(pub => pub.categoria === filtroCategoria);
    }

    if (filtroEstado) {
      filtradas = filtradas.filter(pub => pub.estado === filtroEstado);
    }

    setPublicaciones(filtradas);
  } catch (error) {
    console.error("Error al aplicar filtros:", error);
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
      aplicarFiltros();
    } catch (error) {
      alert("Error al actualizar estado: " + (error.message || "Desconocido"));
    }
  };

  const esAdmin = usuario?.role === "administrador";

  return (
    <div className="publicaciones-container">
  <h1 className="publicaciones-titulo">Publicaciones</h1>
  
      {esAdmin && (
        <div className="filtros">
          <label>Filtrar por categoría:</label>
          <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
            <option value="">-- Todas --</option>
            <option value="sugerencia">Sugerencia</option>
            <option value="reclamo">Reclamo</option>
          </select>

          <label>Filtrar por estado:</label>
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="">-- Todos --</option>
            <option value="pendiente">Pendiente</option>
            <option value="revisada">Revisada</option>
            <option value="denegada">Denegada</option>
          </select>

          <button className="btn-filtrar" onClick={aplicarFiltros}>Aplicar filtros</button>
        </div>
      )}

      {publicaciones.length === 0 ? (
        <p>No hay publicaciones para mostrar.</p>
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
              <p><strong>Autor:</strong> {pub.autor?.username}</p>

              {esAdmin && (
                <div className="estado-form">
                  <label>Cambiar estado:</label>
                  <select
                    value={formData.estado || ""}
                    onChange={(e) => handleEstadoChange(pub.id, "estado", e.target.value)}
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
                      onChange={(e) => handleEstadoChange(pub.id, "comentario", e.target.value)}
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
