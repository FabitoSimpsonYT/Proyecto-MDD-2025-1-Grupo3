// src/pages/editarPublicacion.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { obtenerPublicacionPorId } from "../services/publicaciones.service";
import FormularioPublicacion from "../components/FormularioPublicacion";

function PaginaEditarPublicacion() {
  const { id } = useParams();
  const [publicacion, setPublicacion] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await obtenerPublicacionPorId(id, token);
        setPublicacion(data);
      } catch (error) {
        alert("Error al cargar publicación");
      } finally {
        setCargando(false);
      }
    };
    fetch();
  }, [id]);

  if (cargando) return <p>Cargando publicación...</p>;
  if (!publicacion) return <p>No se encontró la publicación.</p>;

  return (
    <FormularioPublicacion
      modo="editar"
      publicacionExistente={publicacion}
      onSuccess={() => alert("Publicación actualizada")}
    />
  );
}

export default PaginaEditarPublicacion;

