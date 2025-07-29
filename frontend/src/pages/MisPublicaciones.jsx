import { useEffect, useState } from "react";
import { eliminarPublicacion, obtenerMisPublicaciones, actualizarPublicacion } from "../services/publicaciones.service";
import "@styles/publicaciones.css";

const MisPublicaciones = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({ titulo: "", contenido: "", categoria: "" });

  useEffect(() => {
    const cargar = async () => {
      try {
        const datos = await obtenerMisPublicaciones();
        setPublicaciones(datos || []);
      } catch (error) {
        console.error("Error al cargar mis publicaciones:", error);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const handleEditar = (pub) => {
    setEditandoId(pub.id);
    setForm({
      titulo: pub.titulo,
      contenido: pub.contenido,
      categoria: pub.categoria,
    });
  };

  const handleCancelar = () => {
    setEditandoId(null);
    setForm({ titulo: "", contenido: "", categoria: "" });
  };

  const handleEliminar = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de que quieres eliminar esta publicación?");
    if (!confirmar) return;

    try {
      await eliminarPublicacion(id);
      setPublicaciones(prev => prev.filter(pub => pub.id !== id));
    } catch (error) {
      console.error("Error al eliminar publicación:", error);
      alert("Ocurrió un error al eliminar la publicación.");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    if (!form.titulo || !form.contenido || !form.categoria) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      await actualizarPublicacion(editandoId, form);
    const nuevas = await obtenerMisPublicaciones(); // 🔁 refresca todo
    setPublicaciones(nuevas);
      alert("Publicación actualizada.");
      setEditandoId(null);
    } catch (error) {
      alert("Ocurrió un error al actualizar la publicación.");
    }
  };

  return (
    <div className="publicaciones-container">
      <h1>Mis Publicaciones</h1>

      {cargando ? (
        <p>Cargando publicaciones...</p>
      ) : publicaciones.length === 0 ? (
        <p>No has hecho ninguna publicación aún.</p>
      ) : (
        publicaciones.map((pub) => (
          <div key={pub.id} className="publicacion-card">
            {editandoId === pub.id ? (
              <>
                <input
                  type="text"
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  placeholder="Título"
                  required
                />
                <textarea
                  name="contenido"
                  value={form.contenido}
                  onChange={handleChange}
                  placeholder="Contenido"
                  required
                />
                <input
                  type="text"
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                  placeholder="Categoría"
                  required
                />
                <div className="acciones">
                  <button onClick={handleGuardar}>Guardar</button>
                  <button onClick={handleCancelar}>Cancelar</button>
                </div>
              </>
            ) : (
              <>
                <h3>{pub.titulo}</h3>
                <p><strong>Categoría:</strong> {pub.categoria}</p>
                <p><strong>Contenido:</strong> {pub.contenido}</p>
                <p><strong>Estado:</strong> {pub.estado || "pendiente"}</p>
                <p><strong>Comentario admin:</strong> {pub.comentario || "Ninguno"}</p>
                <p><strong>Fecha de creación:</strong> {new Date(pub.createdAt).toLocaleString()}</p>
                <div className="acciones">
                  <button className="btn-editar" onClick={() => handleEditar(pub)}>Editar</button>
                  <button className="btn-eliminar" onClick={() => handleEliminar(pub.id)}>Eliminar</button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MisPublicaciones;
