import { Router } from "express"
import ProductManager from "../Class/productManager.js"
//import { __dirname } from "../utils.js"

//const productManager = new ProductManager(__dirname + '/db/products.json')
const productManager = new ProductManager()
const router = Router()


router.get('/', async (req, res) => {
    const productList = await productManager.getProductList()
    productList.length != 0 ?
    res.status(200).json({
        payload: [...productList]
    }) :
    res.status(400).json({
        message: "No existen productos"
    })
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
        res.status(200).json({
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