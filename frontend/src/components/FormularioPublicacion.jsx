import React, { useState, useEffect } from "react";
import { crearPublicacion } from "../services/publicaciones.service";

function FormularioPublicacion({ onSuccess = () => {} }) {
  const [tipo, setTipo] = useState("sugerencia");
  const [form, setForm] = useState({
    titulo: "",
    contenido: "",
    categoria: "sugerencia",
  });

  // Opciones con contenido relacionado
  const OPCIONES_DETALLADAS = {
    sugerencia: {
      "Instalar cámaras de seguridad en los accesos principales.": "Mejora la vigilancia y reduce incidentes delictivos.",
      "Agregar más iluminación en los pasillos y estacionamientos.": "Incrementa la seguridad y comodidad para todos los residentes durante la noche.",
      "Implementar un sistema de reservas online para el quincho.": "Facilita la organización y evita conflictos entre vecinos.",
      "Crear un grupo de WhatsApp para emergencias del edificio.": "Permite comunicación rápida ante situaciones críticas.",
      "Agregar contenedores de reciclaje en el sector de basura.": "Fomenta el reciclaje y mejora la gestión de residuos.",
    },
    reclamo: {
      "Vecinos que hacen ruidos molestos durante la noche.": "Solicito intervención para mantener la tranquilidad del edificio.",
      "Fugas de agua en áreas comunes no reparadas.": "Genera desperdicio y puede causar daños estructurales.",
      "Ascensor funcionando de manera intermitente.": "Dificulta el acceso y puede generar accidentes.",
      "Basura acumulada en espacios comunes.": "Causa malos olores y posibles focos de infección.",
      "Mascotas sueltas sin supervisión en pasillos.": "Puede causar molestias o accidentes entre los vecinos.",
    },
  };

  useEffect(() => {
    setForm((prev) => ({ ...prev, categoria: tipo }));
  }, [tipo]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await crearPublicacion(form, token);
      alert(res.message || "Publicación creada correctamente");
      setForm({ titulo: "", contenido: "", categoria: tipo });
      onSuccess();
    } catch (error) {
      alert("Error al crear publicación: " + (error.message || "Desconocido"));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-publicacion">
      <div className="form-row">
        <label>Tipo:</label>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="sugerencia">Sugerencia</option>
          <option value="reclamo">Reclamo</option>
        </select>
      </div>

      <div className="form-row">
        <label>Título (elige uno o escribe):</label>
        <select
          value={form.titulo}
          onChange={(e) => {
            const tituloSeleccionado = e.target.value;
            const contenidoAuto = OPCIONES_DETALLADAS[tipo][tituloSeleccionado] || "";
            setForm({
              ...form,
              titulo: tituloSeleccionado,
              contenido: contenidoAuto,
            });
          }}
        >
          <option value="">-- Elegir una opción predefinida --</option>
          {Object.keys(OPCIONES_DETALLADAS[tipo]).map((titulo, idx) => (
            <option key={idx} value={titulo}>
              {titulo}
            </option>
          ))}
        </select>

        <input
          name="titulo"
          placeholder="Título personalizado (si no elegiste)"
          value={form.titulo}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <textarea
          name="contenido"
          placeholder="Contenido"
          value={form.contenido}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-buttons">
        <button type="submit" className="btn-publicar">
          Crear Publicación
        </button>
      </div>
    </form>
  );
}

export default FormularioPublicacion;
