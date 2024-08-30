import { Router } from "express";
import { CategoriasModel } from "../models/category.model.js";

const router = Router()



router.post('/', async (req, res) => {
    const { description } = req.body

    await CategoriasModel.create({
        description
    })

    res.status(201).json({
        message:"Categoría creada"
    })
})

router.get('/', async (req, res) => {
    try{
        const categoryList = await CategoriasModel.find()
        categoryList.length != 0 ?
        res.status(200).json({
            ...categoryList
        }) :
        res.status(400).json({
            message: "No existen categorias"
        })
    }
    catch(err){
        res.status(404).json({
            message: "Error en la consulta"
        })
    }
    
})

export default router