import { Router } from "express"
import ProductManager from "../Class/productManager.js"
import { __dirname } from "../utils.js"


const productManager = new ProductManager(__dirname + '/db/products.json')

const router = Router()

//DONE
//Obtener todos los productos (incluir ?limit)
router.get('/', async (req, res) => {
    const productList = await productManager.getProductList()
    console.log(productList);
    productList.length != 0 ?
    res.status(200).json({
        payload: [...productList]
    }) :
    res.status(400).json({
        message: "No existen productos"
    })
})

//DONE
//Obtener producto pid
router.get('/:pid', async (req, res, next) => {
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

//DONE
//Agregar producto (id, title, description, code, price, status, stock, category, thumbnails)
router.post('/', async (req, res) => {
    const product = req.body
    //Validar body
    await productManager.addProduct(product)
    
    res.status(201).json({
        mensaje: "Producto agregado con éxito!",
        payload: product
    })
})

//DONE
//Actualizar producto pid (nunca actualizar o eliminar el id)
router.put('/:pid', async (req, res) => {
    const { pid } = req.params
    const newData = req.body
    //Validar body
    const prodFinded = await productManager.getProductById(pid)
    if (prodFinded){
        await productManager.updateProductById(pid, newData)
        res.status(200).json({
            message: "Producto modificado con éxito"
        })
    } else res.status(400).json({
        message: "Producto no encontrado"
    })
})

//DONE
//Eliminar producto pid
router.delete('/:pid', async (req, res) => {
    const {pid} = req.params
    const prodFinded = await productManager.getProductById(pid)
    if (prodFinded){
        await productManager.deleteProductById(pid)
        res.status(200).json({
            message: "Producto eliminado con éxito"
        })
    } else
        res.status(400).json({
            message: "Producto no encontrado"
        })  
})


export default router