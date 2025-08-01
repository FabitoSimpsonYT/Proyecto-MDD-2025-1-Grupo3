"use strict"
import visitanteEntity from "../entity/visitante.entity.js";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { createValidation, updatevalidation} from "../validations/visitante.validation.js";
import { Between } from "typeorm";

export async function getvisitantes (req, res){
    try {
        const visitanteRepositorio = AppDataSource.getRepository(visitanteEntity);
        const listavisitantes = await visitanteRepositorio.find();

        res.status(200).json({message:"visitantes encontrados:",data : listavisitantes});
    } catch (error) {
       console.error("error al obtener visitantes ",error)
        res.status(500).json ({message:"error al obtener a los visitantes "});
    } 
}

export async function getvisitanteId(req, res) {
    try {
        const visitanteRepositorio = AppDataSource.getRepository(visitanteEntity);
        const { id } = req.params;
        //busca especificamente al visitante
        const visitante = await visitanteRepositorio.findOne({where: {id} });
        
        if (!visitante){
            return res.status(404).json({message: "usuario no encontrado"});
        }
        res.status(200).json({message: "usuario encontrado:",date: visitante});
    } catch (error) {
        console.error("error al obtener visitante ",error)
        res.status(500).json ({message:"error al obtener a los visitante "});
    }
    
}

export async function createvisitante (req, res) {
    try {
        const visitanteRepositorio = AppDataSource.getRepository(visitanteEntity);
         const userRepository = AppDataSource.getRepository(User);
        const { nombre, edad, numerocasa, email, descripcion} = req.body;
     
        const { error }  =  createValidation.validate(req.body);
        if (error)  return res.status(400).json({message:"error al crear al visitante:",error: error});
       
        const user = await userRepository.findOne({
            where: {email: req.user?.email},
        });

        if(!user){
            return res.status(404).json({message: "usuario no encontrado"});
        };

    

        const inicioDia = new Date(); 
        inicioDia.setHours(0,0,0,0);

        const finDia = new Date();
        finDia.setHours(23, 59, 999);
    
        const visitantesHoy = await visitanteRepositorio.count({
            where: {
                residente: { id: user.id},
                createdAt: Between(inicioDia, finDia),
            },
        });

        if(visitantesHoy >= 2){
            return res.status(403).json({message: "solo se pude registrar hasta 2 visitantes al dia "});
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

export async function updatevisitante(req, res) {
    try {
        const visitanteRepositorio = AppDataSource.getRepository(visitanteEntity);
        
        const{ id } = req.params;
        const { nombre, edad, numerocasa, email, descripcion} = req.body;
        const visitante = await visitanteRepositorio.findOne({ where: {id} });

        if(!visitante){
            return res.status(404).json({message: "usuario no encontrado"});
        }
       const { error } = updatevalidation.validate(req. body);
       if(error) return res.status(400).json({message: error.message});
      
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
export async function deletevisitante(req, res) {
    try {
        const visitanteRepositorio = AppDataSource.getRepository(visitanteEntity);
        const{ id } = req.params;
        const visitante = await visitanteRepositorio.findOne({where: { id } });
        
        if (!visitante) return res.status(404).json({message: "usuario no encontrado "});
        
        await visitanteRepositorio.remove(visitante);

        res.status(200).json({message : "usuario eliminado exitosamente"});
    } catch (error) {
        console.error("error al eliminar al visitante ",error)
        res.status(500).json ({message:"error al eliminar al visitante "})
    }
}
