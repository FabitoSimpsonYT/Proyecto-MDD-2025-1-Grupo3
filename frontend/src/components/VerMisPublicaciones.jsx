import { useEffect, useState } from "react";
import { obtenerMisPublicaciones } from "../services/publicaciones.service";
import "@styles/publicaciones.css";

const MisPublicaciones = () => {
  const [publicaciones, setPublicaciones] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const datos = await obtenerMisPublicaciones();
        setPublicaciones(datos);
      } catch (error) {
        console.error("Error al cargar mis publicaciones:", error);
      }
    };
    cargar();
  }, []);

  return (
    <div className="publicaciones-container">
      <h1>Mis Publicaciones</h1>
      {publicaciones.length === 0 ? (
        <p>No has hecho ninguna publicación.</p>
      ) : (
        publicaciones.map((pub) => (
          <div key={pub.id} className="publicacion-card">
            <h3>{pub.titulo}</h3>
            <p><strong>Categoría:</strong> {pub.categoria}</p>
            <p><strong>Contenido:</strong> {pub.contenido}</p>
            <p><strong>Estado:</strong> {pub.estado || "pendiente"}</p>
            <p><strong>Comentario admin:</strong> {pub.comentario || "Ninguno"}</p>
            <p><strong>Fecha de creación:</strong> {new Date(pub.createdAt).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default MisPublicaciones;
