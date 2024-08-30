import { Router } from "express"
import ProductManager from "../Class/productManager.js"
import { ProductModel } from "../models/product.model.js"
import { paginate } from "mongoose-paginate-v2";
//import { __dirname } from "../utils.js"

//const productManager = new ProductManager(__dirname + '/db/products.json')
const productManager = new ProductManager()
const router = Router()


router.get('/', async (req, res) => {
    const { limit = 10, page = 1, sort = '', ...query} = req.query
    const sortManager = {
        'asc': 1,
        'desc': -1
    }
    try{
        const productList = await ProductModel.paginate(
            {...query},
            {
                limit,
                page,
                ...(sort && { sort: {price: sortManager[sort]} }),
                customLabels: { docs: 'payload'}
            }
        )
        productList.length != 0 ?
        res.status(200).json({
            status:'success',
            ...productList
        }) :
        res.status(400).json({
            status: 'error',
            message: "No existen productos"
        })      
    }
    catch(err){
        res.status(404).json({
            status:'error',
            message: "Error al traer productos. Parámetro inválido."
        })
    }
    
})


router.get('/:pid', async (req, res) => {
    const { pid } = req.params
    const productFinded = await productManager.getProductById(pid)
    productFinded ? 
        res.status(200).json({
            message: "Producto encontrado!",
            payload: productFinded
        }) :
        res.status(400).json({
            mensaje: "Producto no encontrado."
        })
})


router.post('/', async (req, res) => {
    const product = req.body
    //Validar body
    const newProd = await productManager.addProduct(product)
    res.status(201).json({
        mensaje: "Producto agregado con éxito!",
        payload: newProd
    })
})


router.put('/:pid', async (req, res) => {
    const { pid } = req.params
    const newData = req.body
    //Validar body
    const prodFinded = await productManager.getProductById(pid)
    if (prodFinded){
        const prodUpdated = await productManager.updateProductById(pid, newData)
        res.status(201).json({
            message: "Producto modificado con éxito",
            payload: prodUpdated
        })
    } else res.status(400).json({
        message: "Producto no encontrado"
    })
})


router.delete('/:pid', async (req, res) => {
    const {pid} = req.params
    const prodFinded = await productManager.getProductById(pid)
    if (prodFinded){
        const result = await productManager.deleteProductById(pid)
        res.status(200).json({
            message: "Producto eliminado con éxito",
            payload: result
        })
    } else
        res.status(400).json({
            message: "Producto no encontrado"
        })  
})

export default router