import { useState, useEffect } from "react";
import { actualizarEstado } from "../services/publicaciones.service";

const EstadoPublicacion = ({
  idPublicacion,
  estadoInicial,
  comentarioInicial,
  onActualizada,
  publicaciones,
  setPublicaciones,
}) => {
  const [estado, setEstado] = useState(estadoInicial || "pendiente");
  const [comentario, setComentario] = useState(comentarioInicial?.trim() || "");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    setEstado(estadoInicial || "pendiente");
    setComentario(comentarioInicial?.trim() || "");
  }, [estadoInicial, comentarioInicial]);

  useEffect(() => {
    if (estado === "pendiente") {
      setComentario("");
    }
  }, [estado]);

  const handleCambiarEstado = async () => {
    const comentarioFinal = comentario.trim();

    if (estado === "denegada" && comentarioFinal === "") {
      setError("El comentario es obligatorio para publicaciones denegadas.");
      return;
    }

    try {
      setCargando(true);

      await actualizarEstado(idPublicacion, {
        estado,
        comentario: comentarioFinal,
      });

      if (setPublicaciones && publicaciones) {
        const publicacionesActualizadas = publicaciones.map((p) =>
          p.id === idPublicacion
            ? { ...p, estado, comentario: comentarioFinal }
            : p
        );
        setPublicaciones(publicacionesActualizadas);
      }

      setError("");
      alert("Estado actualizado correctamente");

      if (onActualizada) onActualizada();
    } catch (e) {
      alert(e.message || "Error al actualizar estado");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="estado-publicacion">
      {comentario.trim() && (
        <p>
          <strong>Comentario admin:</strong> {comentario}
        </p>
      )}

      <label>
        Cambiar estado:
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          disabled={cargando}
        >
          <option value="pendiente">Pendiente</option>
          <option value="revisada">Revisada</option>
          <option value="denegada">Denegada</option>
        </select>
      </label>

      {(estado === "revisada" || estado === "denegada") && (
        <textarea
          placeholder="Comentario del administrador"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          disabled={cargando}
        />
      )}

      {error && <p className="error">{error}</p>}

      <button onClick={handleCambiarEstado} disabled={cargando}>
        {cargando ? "Guardando..." : "Guardar estado"}
      </button>
    </div>
  );
};

export default EstadoPublicacion;
