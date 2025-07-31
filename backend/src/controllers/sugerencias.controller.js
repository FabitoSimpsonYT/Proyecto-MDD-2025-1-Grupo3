"use strict";

import { Publicacion } from "../entity/sugerencias.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { createValidation } from "../validations/sugerencia.validation.js";
import UserEntity from "../entity/user.entity.js";



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


export async function getPublicacionPorId(req, res) {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const publicacionRepo = AppDataSource.getRepository(Publicacion);
    const pub = await publicacionRepo.findOne({
      where: { id },
      relations: ["autor"],
    });

    if (!pub) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    // Protegemos el acceso (si se desea)
    if (req.user?.username !== pub.autor.username) {
      return res.status(403).json({ message: "No tienes permiso para ver esta publicación." });
    }

    const publicacion = {
      id: pub.id,
      titulo: pub.titulo,
      contenido: pub.contenido,
      categoria: pub.categoria,
      estado: pub.estado,
      comentario: pub.comentario,
      createdAt: pub.createdAt,
      updatedAt: pub.updatedAt,
      autor: {
        id: pub.autor.id,
        username: pub.autor.username,
      },
    };

    res.status(200).json({
      message: "Publicación encontrada",
      data: publicacion,
    });
  } catch (error) {
    console.error("Error al obtener publicación:", error);
    res.status(500).json({ message: "Error interno al obtener publicación" });
  }
}


export async function getMisPublicaciones(req, res) {
  try {
    const username = req.user?.username; // Tomamos el username del usuario autenticado

    if (!username) {
      return res.status(400).json({ message: "Nombre de usuario no disponible." });
    }

    const publicacionRepo = AppDataSource.getRepository(Publicacion);

    const publicaciones = await publicacionRepo.find({
      where: {
        autor: { username: username }
      },
      relations: ["autor"],
    });

    if (publicaciones.length === 0) {
      return res.status(404).json({ message: "No se encontraron publicaciones para este usuario." });
    }

    const publicacionesFiltradas = publicaciones.map(pub => ({
      id: pub.id,
      titulo: pub.titulo,
      contenido: pub.contenido,
      categoria: pub.categoria,
      estado: pub.estado,
      comentario: pub.comentario,
      createdAt: pub.createdAt,
      updatedAt: pub.updatedAt,
      autor: {
        id: pub.autor.id,
        username: pub.autor.username,
      },
    }));

    res.status(200).json({
      message: `Publicaciones del usuario ${username} encontradas.`,
      data: publicacionesFiltradas,
    });
  } catch (error) {
    console.error("Error al obtener mis publicaciones:", error);
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
      relations: ["autor"], 
    });

    const publicacionesFiltradas = publicaciones.map(pub => {
      const { autor, ...filtroC } = pub;
      return {
        ...filtroC,
        autor: autor ? {
          id: autor.id,
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
    console.log("Datos recibidos en el body:", req.body);
    console.log("Usuario autenticado:", req.user);

    const sugerenciaRepo = AppDataSource.getRepository(Publicacion);
    const userRepo = AppDataSource.getRepository(UserEntity);

    const { titulo, contenido, categoria } = req.body;

    const { error } = createValidation.validate(req.body);
    if (error)
      return res.status(400).json({
        message: "Error al realizar esta acción.",
        error,
      });


    const autor = await userRepo.findOneBy({ id: req.user.id });
    if (!autor)
      return res.status(404).json({ message: "Usuario no encontrado" });

    const nuevaSugerencia = sugerenciaRepo.create({
      titulo,
      contenido,
      categoria,
      autor, 
    });

    await sugerenciaRepo.save(nuevaSugerencia);

    res.status(201).json({
      message: "Publicación creada con éxito!",
      data: {
        id: nuevaSugerencia.id,
        titulo: nuevaSugerencia.titulo,
        contenido: nuevaSugerencia.contenido,
        categoria: nuevaSugerencia.categoria,
        estado: nuevaSugerencia.estado,
        autor: autor.nombre, // 👈 ahora sí tienes el nombre
      },
    });
  } catch (error) {
    console.error("Error al crear la publicación", error);
    res.status(500).json({ message: "Error al crear la publicación" });
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

    const categoriasValidas = ["sugerencia", "reclamo"];
    if (categoria !== undefined && !categoriasValidas.includes(categoria)) {
      return res.status(400).json({ message: "Categoría inválida. Debe ser 'sugerencia' o 'reclamo'." });
    }

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
  publicacion.comentario = comentario.trim(); 
} else {
  publicacion.comentario = comentario?.trim() || null; 
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
    const userId = req.user.id;

    const sugerenciaRepo = AppDataSource.getRepository(Publicacion);
    const publicacionEncontrada = await sugerenciaRepo.findOne({
      where: { id },
      relations: ["autor"],
    });

    // 🔍 Logs de depuración:
    console.log("🟡 ID recibido en params:", id);
    console.log("🔐 Usuario autenticado:", req.user);
    console.log("📘 Publicación encontrada:", publicacionEncontrada);
    console.log("👤 ID del autor de la publicación:", publicacionEncontrada?.autor?.id);
    console.log("🧑‍💼 ID del usuario autenticado:", userId);

    if (!publicacionEncontrada) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    if (String(publicacionEncontrada.autor.id) !== String(userId)) {
      return res.status(403).json({ message: "No tienes permiso para eliminar esta publicación" });
    }

    await sugerenciaRepo.remove(publicacionEncontrada);

    res.status(200).json({ message: "Publicación eliminada de forma exitosa!" });
  } catch (error) {
    console.error("❌ Error al eliminar la publicación", error);
    res.status(500).json({ message: "Error al eliminar la publicación" });
  }
}
