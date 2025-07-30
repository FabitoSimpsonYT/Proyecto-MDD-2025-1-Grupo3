import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerPublicacionPorId, actualizarPublicacion } from "../services/publicaciones.service";

const EditarPublicacion = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    titulo: "",
    contenido: "",
    categoria: "",
  });

  useEffect(() => {
    const cargarPublicacion = async () => {
      try {
        const data = await obtenerPublicacionPorId(id);
        setForm({
          titulo: data.titulo || "",
          contenido: data.contenido || "",
          categoria: data.categoria || "",
        });
      } catch (error) {
        console.error("Error cargando publicación:", error);
      }
    };

    cargarPublicacion();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.titulo || !form.contenido || !form.categoria) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      await actualizarPublicacion(id, form);
      alert("Publicación actualizada con éxito");
      navigate("/mis-publicaciones");
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Ocurrió un error al actualizar la publicación.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Editar Publicación</h1>

      <input
        type="text"
        name="titulo"
        placeholder="Título"
        value={form.titulo}
        onChange={handleChange}
        required
      />

      <textarea
        name="contenido"
        placeholder="Contenido"
        value={form.contenido}
        onChange={handleChange}
        required
      />
      <select
        name="categoria"
        value={form.categoria}
        onChange={handleChange}
        required
      >
        <option value="">-- Selecciona una categoría --</option>
        <option value="reclamo">Reclamo</option>
        <option value="sugerencia">Sugerencia</option>
      </select>

      <button type="submit">Actualizar publicación</button>
    </form>
  );
};

export default EditarPublicacion;

