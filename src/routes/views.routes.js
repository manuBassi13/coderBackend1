import { Router } from "express"
import { productManager } from "../app.js"
const router = Router()
let listaProductos = []




router.get('/', async (req, res) => {
    listaProductos = await productManager.getProductList()
    res.render('home', {listaProductos})
})

router.get('/realtimeproducts', async (req, res) => {
    listaProductos = await productManager.getProductList()
    res.render('realTimeProducts', {listaProductos})
})

export default router