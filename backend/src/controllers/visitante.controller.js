"use strict"
import visitanteEntity from "../entity/visitante.entity.js";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { createValidation, updatevalidation} from "../validations/visitante.validation.js";
import { Between } from "typeorm";

// Obtener todos los visitantes registrados
export async function getvisitantes(req, res) {
  try {
    const visitanteRepositorio = AppDataSource.getRepository(visitanteEntity);
    let visitantes;
    if (req.user.role === "administrador") {
      visitantes = await visitanteRepositorio.find({
        order: { createdAt: "DESC" },
      });
    } 
    res.status(200).json({ message: "Visitantes encontrados", data: visitantes });
  } catch (error) {
    console.error("Error al obtener visitantes:", error);
    res.status(500).json({ message: "Error al obtener visitantes" });
  }
}

// Obtener un visitante por ID
export async function getvisitanteId(req, res) {
    try {
         // Obtiene el repositorio para acceder a la entidad
        const visitanteRepositorio = AppDataSource.getRepository(visitanteEntity);
        const { id } = req.params;
        const useId = req.user.id;

        //busca especificamente al visitante
        const visitante = await visitanteRepositorio.findOne({
            where: {
                id,
                residente: {id: useId}
            } 
        });
        
        if (!visitante){
            return res.status(404).json({message: "usuario no encontrado"});
        }
        res.status(200).json({message: "usuario encontrado:",date: visitante});
    } catch (error) {
        console.error("error al obtener visitante ",error)
        res.status(500).json ({message:"error al obtener a los visitante "});
    }
    
}

// Crear un nuevo visitante
export async function createvisitante (req, res) {
    try {
        const visitanteRepositorio = AppDataSource.getRepository(visitanteEntity);
        const userRepository = AppDataSource.getRepository(User);
        const { nombre, edad, numerocasa, email, descripcion} = req.body;
     //validar los datos con joi
        const { error }  =  createValidation.validate(req.body);
        // Validación con Joi
        const useId = req.user.id;
        if (error) {
         return res.status(400).json({ message: "Error de validación", error: error.details });
        }
         
        // Busca al usuario que está creando el visitante 
        const user = await userRepository.findOne({
            where: {email: req.user?.email},
        });

        if(!user){
            return res.status(404).json({message: "usuario no encontrado"});
        };

        //calcular inicio y fin del dia actual 
        const inicioDia = new Date(); 
        inicioDia.setHours(0,0,0,0);

        const finDia = new Date();
        finDia.setHours(23, 59, 59, 999);

        //contar los visitantes del usuario de se registro hoy
        if (req.user.role!== "administrador") {
          const visitantesHoy = await visitanteRepositorio.count({
                where: {
                 residente: { id: user.id },
                 createdAt: Between(inicioDia, finDia),
                },
           });
           console.log("Visitantes registrados hoy:", visitantesHoy); 
          if (visitantesHoy >= 2) {
           return res.status(403).json({ message: "Solo se pueden registrar hasta 2 visitantes al día" });
           }
        }
        const newvisitante = visitanteRepositorio.create({
         nombre,
         edad, 
         numerocasa, 
         email,
         descripcion,
         residente: { id: user.id},
        });

        await visitanteRepositorio.save(newvisitante);

        res.status(201).json({
        message :"visitante creado exitosamente",
        data : newvisitante,
        });
    } catch (error) {
        console.error("error al crear visitante ",error)
        res.status(500).json ({message:"error al crear visitante "});
    }
}
// Actualizar visitante por ID
export async function updatevisitante(req, res) {
    try {
        const visitanteRepositorio = AppDataSource.getRepository(visitanteEntity);
        
        const{ id } = req.params;
        const userId = req.user.id;
        const { nombre, edad, numerocasa, email, descripcion} = req.body;
        const visitante = await visitanteRepositorio.findOne({
          where: req.user.role === "administrador"
         ? { id } // admin puede actualizar cualquiera
         : { id, residente: { id: userId } }, // usuario solo los suyos
         relations: ["residente"],
       });

        if(!visitante){
            return res.status(404).json({message: "usuario no encontrado"});
        }

        // Validación con Joi
       const { error } = updatevalidation.validate(req. body);
       if(error) return res.status(400).json({message: error.message});
      // Actualizar solo los campos recibidos
        visitante.nombre = nombre || visitante.nombre;
        visitante.edad = edad || visitante.edad;
        visitante.numerocasa = numerocasa || visitante.numerocasa;
        visitante.email = email || visitante.email;
        visitante.descripcion = descripcion || visitante.descripcion;

        await visitanteRepositorio.save(visitante);
        res
         .status(200)
         .json({message: "usuario actualizado exitosamente",data: visitante});
    } catch (error) {
        console.error("error al actualizar al visitante",error)
        res.status(500).json ({message:"error al actualizar al visitante "})
    }
    
}
// Eliminar visitante por ID
export async function deletevisitante(req, res) {
    try {
        const visitanteRepositorio = AppDataSource.getRepository(visitanteEntity);
        const{ id } = req.params;
        const visitante = await visitanteRepositorio.findOne({
          where: req.user.role === "administrador"
          ? { id }
          : { id, residente: { id: req.user.id } },
          relations: ["residente"],
        });

        
        if (!visitante) return res.status(404).json({message: "usuario no encontrado "});
        
        await visitanteRepositorio.remove(visitante);

        res.status(200).json({message : "usuario eliminado exitosamente"});
    } catch (error) {
        console.error("error al eliminar al visitante ",error)
        res.status(500).json ({message:"error al eliminar al visitante "})
    }
}
