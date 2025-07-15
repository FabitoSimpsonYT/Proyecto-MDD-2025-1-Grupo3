"use strict";

import { Publicacion } from "../entity/sugerencias.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { createValidation } from "../validations/sugerencia.validation.js";

export async function getPublicacion(req, res) {
    try {
        const sugerenciaRepo = AppDataSource.getRepository(Publicacion);
        const guardado = await sugerenciaRepo.find();

        res.status(200).json({  message: "Publicaciones hechas encontradas!", data: guardado })
      } catch (error) {
    console.error("Error al encontrar las publicaciones hechas", error);
    res.status(500).json({ message: "Error al encontrar las publicaciones hechas"})
  }
  
}


export async function getPublicacionesPorCategoria(req, res) {
  try {
    const categoria = req.query.categoria;

    const sugerenciaRepo = AppDataSource.getRepository(Publicacion);

    const publicaciones = await sugerenciaRepo.find({
      where: { categoria },
    });

    res.status(200).json({
      message: `Publicaciones de categoría "${categoria}" encontradas`,
      data: publicaciones,
    });
  } catch (error) {
    console.error("Error al obtener publicaciones por categoría", error);
    res.status(500).json({ message: "Error al obtener publicaciones por categoría" });
  }
}


export async function getPublicacionesPorEstado(req, res) {
  try {
    const { estado } = req.query.estado;

    const estadosValidos = ["pendiente", "revisada", "denegada"];
    if (!estado || !estadosValidos.includes(estado)) {
      return res.status(400).json({ message: "Estado inválido o no enviado" });
    }

    const sugerenciaRepo = AppDataSource.getRepository(Publicacion);
    const publicaciones = await sugerenciaRepo.find({ where: { estado } });

    res.status(200).json({
      message: `Publicaciones con estado "${estado}" encontradas`,
      data: publicaciones,
    });
  } catch (error) {
    console.error("Error al obtener publicaciones por estado", error);
    res.status(500).json({ message: "Error al obtener publicaciones por estado" });
  }
}


export async function createPublicacion(req, res) {
    try {
        const sugerenciaRepo = AppDataSource.getRepository(Publicacion);
        const { titulo, contenido, categoria } = req.body;
        const { error } = createValidation.validate(req.body);
        if (error) return res.status(400).json({ message: "Error al realizar esta acción.", error: error})

        const nuevaSugerencia = sugerenciaRepo.create({ 
          titulo, 
          contenido,
          categoria
         });
          await sugerenciaRepo.save(nuevaSugerencia);
          res.status(201).json({
            message: "Publicacion creada con exito!",
            data: nuevaSugerencia,
          });
    } catch (error) {
        console.error("Error al crear la publicación", error);
        res.status(500).json({ message: "Error al crear la publicación"});
    }
    
}


export async function updatePublicacion(req, res) {
  try {
    const publicacionRepo = AppDataSource.getRepository(Publicacion);
    const id = req.params.id;

    const { error } = updateValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const publicacion = await publicacionRepo.findOneBy({ id });
    if (!publicacion) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    const { titulo, contenido, categoria } = req.body;

    // Solo se permiten estas actualizaciones (sin tocar estado ni comentario)
    if (titulo !== undefined) publicacion.titulo = titulo;
    if (contenido !== undefined) publicacion.contenido = contenido;
    if (categoria !== undefined) publicacion.categoria = categoria;

    await publicacionRepo.save(publicacion);

    return res.status(200).json({
      message: "Publicación actualizada con éxito",
      data: publicacion,
    });
  } catch (error) {
    console.error("Error al actualizar la publicación", error);
    return res.status(500).json({ message: "Error al actualizar la publicación" });
  }
}



export async function updateEstadoComentario(req, res) {
  try {
    const publicacionRepo = AppDataSource.getRepository(Publicacion);
    const id = parseInt(req.params.id);
    const { estado, comentario } = req.body;

    const publicacion = await publicacionRepo.findOneBy({ id });

    if (!publicacion) {
      return res.status(404).json({ message: "Publicación no encontrada." });
    }

    const estadosValidos = ["pendiente", "revisada", "denegada"];
    if (!estado || !estadosValidos.includes(estado)) {
      return res.status(400).json({ message: "Estado inválido o no enviado." });
    }

if (estado === "denegada") {
  if (!comentario || comentario.trim() === "") {
    return res.status(400).json({ message: "Debe incluir un comentario al denegar una publicación." });
  }
  publicacion.comentario = comentario.trim(); // guarda el comentario limpio
} else {
  publicacion.comentario = comentario?.trim() || null; // opcional en otros estados
}

publicacion.estado = estado;

    await publicacionRepo.save(publicacion);

    return res.status(200).json({
      message: "Estado y comentario actualizados correctamente.",
      data: publicacion,
    });

  } catch (error) {
    console.error("Error al actualizar estado y comentario", error);
    return res.status(500).json({ message: "Error interno al actualizar la publicación." });
  }
}



export async function deletePublicacion(req, res) {
  try {
     
     const { id } = req.params.id;
     const sugerenciaRepo = AppDataSource.getRepository(Publicacion);
     const publicacionEncontrada = await sugerenciaRepo.findOne({ where: { id } });
   
     if(!publicacionEncontrada) return res.status(404).json({ message: "Publicacion no encontrada"});

     await sugerenciaRepo.remove(publicacionEncontrada);
     
     res.status(200).json({ message: "Publicación eliminada de forma exitosa!"});
  } catch (error) {
    console.error("Error al eliminar la publicación", error);
    res.status(500).json({ message: "Error al eliminar la publicación"});
  }
}