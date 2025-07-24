"use strict";

import { Publicacion } from "../entity/sugerencias.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { createValidation } from "../validations/sugerencia.validation.js";
import { In } from "typeorm";
import User from "../entity/user.entity.js";

export async function getPublicacion(req, res) {
  try {
    const publicacionRepo = AppDataSource.getRepository(Publicacion);

    // Obtiene publicaciones con la relación autor cargada completa
    const publicacionesRaw = await publicacionRepo.find({
      relations: ["autor"],
    });

    const publicaciones = publicacionesRaw.map(pub => ({
      id: pub.id,
      titulo: pub.titulo,
      contenido: pub.contenido,
      categoria: pub.categoria,
      estado: pub.estado,
      comentario: pub.comentario,
      createdAt: pub.createdAt,
      updatedAt: pub.updatedAt,
      autor: pub.autor
        ? {
            id: pub.autor.id,
            username: pub.autor.username,
          }
        : null,
    }));

    res.status(200).json({
      message: "Publicaciones hechas encontradas!",
      data: publicaciones,
    });
  } catch (error) {
    console.error("Error al obtener publicaciones:", error);
    res.status(500).json({ message: "Error interno al obtener publicaciones" });
  }
}

export async function getPublicacionesPorEmail(req, res) {
  try {
    const { email } = req.params;  // o de query: req.query.email
    const publicacionRepo = AppDataSource.getRepository(Publicacion);

    // Buscar publicaciones donde el autor tenga ese email
    const publicaciones = await publicacionRepo.find({
      where: {
        autor: {
          email: email
        }
      },
      relations: ["autor"],
    });

    if (publicaciones.length === 0) {
      return res.status(404).json({ message: "No se encontraron publicaciones para ese correo." });
    }

    // Opcional: devolver solo campos específicos del autor
    const publicacionesFiltradas = publicaciones.map(pub => ({
      ...pub,
      autor: {
        id: pub.autor.id,
        username: pub.autor.username,
        email: pub.autor.email
      }
    }));

    res.status(200).json({
      message: `Publicaciones del usuario ${email} encontradas.`,
      data: publicacionesFiltradas,
    });
  } catch (error) {
    console.error("Error al obtener publicaciones por email", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function getPublicacionesPorCategoria(req, res) {
  try {
    const { categoria }= req.params;
    const CategoriasValidas= ["sugerencia", "reclamo"];
    if (!categoria || !CategoriasValidas.includes(categoria)) {
      return res.status(400).json({ message: "Categoria inválida o no enviada" });
    }

    const sugerenciaRepo = AppDataSource.getRepository(Publicacion);

    const publicaciones = await sugerenciaRepo.find({
      where: { categoria },
      relations: ["autor"],  // aseguramos que cargue la relación
    });

    const publicacionesFiltradas = publicaciones.map(pub => {
      const { autor, ...filtroC } = pub;
      return {
        ...filtroC,
        autor: autor ? {
          id: autor.id,
          email: autor.email,
          username: autor.username,
        } : null,
      };
    });
    res.status(200).json({
      message: `Publicaciones de categoría "${categoria}" encontradas`,
      data: publicacionesFiltradas,
    });
  } catch (error) {
    console.error("Error al obtener publicaciones por categoría", error);
    res.status(500).json({ message: "Error al obtener publicaciones por categoría" });
  }
}


export async function getPublicacionesPorEstado(req, res) {
  try {
    const { estado } = req.params;

    const estadosValidos = ["pendiente", "revisada", "denegada"];
    if (!estado || !estadosValidos.includes(estado)) {
      return res.status(400).json({ message: "Estado inválido o no enviado" });
    }

    const sugerenciaRepo = AppDataSource.getRepository(Publicacion);
    const publicaciones = await sugerenciaRepo.find({
      where: { estado },
      relations: ["autor"],
    });

    const publicacionesFiltradas = publicaciones.map(pub => {
      const { autor, ...filtroE } = pub;
      return {
        ...filtroE,
        autor: autor ? {
          id: autor.id,
          email: autor.email,
          username: autor.username,
        } : null,
      };
    });

    res.status(200).json({
      message: `Publicaciones con estado "${estado}" encontradas`,
      data: publicacionesFiltradas,
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
    const { id } = req.params;

    const sugerenciaRepo = AppDataSource.getRepository(Publicacion);
    const publicacionEncontrada = await sugerenciaRepo.findOne({ where: { id } });

    if (!publicacionEncontrada) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    await sugerenciaRepo.remove(publicacionEncontrada);

    res.status(200).json({ message: "Publicación eliminada de forma exitosa!" });
  } catch (error) {
    console.error("Error al eliminar la publicación", error);
    res.status(500).json({ message: "Error al eliminar la publicación" });
  }
}