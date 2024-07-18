import { Router } from "express"
import { buscarProductosDB, buscarCarritosDB } from "../utils.js"

const listaCarritos = JSON.parse(await buscarCarritosDB())
let listaProductos =  JSON.parse(await buscarProductosDB())
let id = 0
const router = Router()

//Obtener todos los productos (incluir ?limit)
router.get('/', (req, res) => {
    const { limit } = req.query
    //console.log(limit)
    // if((limit > 0) && (limit<= listaProductos.lenght)){
    //     console.log(listaProductos[0]);
    //     for(let i=0; i++; i<limit){
    //         console.log(listaProductos[i]);
    //         //listaProductosFiltrada.push(listaProductos[i])
    //     }
    // }
    res.status(200).json({
        payload: [...listaProductos],
        message: "Ok products"
    })
})

//Obtener producto pid
router.get('/:pid', (req, res, next) => {
    const prodId = req.params.pid
    const producto = listaProductos.find(producto => producto.id == prodId)
    producto ? 
        res.status(200).json({
            ...producto
        }) :
        res.status(400).json({
            mensaje: "Producto con id {"+prodId+"} no encontrado."
        })
})

//Agregar producto (id, title, description, code, price, status, stock, category, thumbnails)
router.post('/', (req, res) => {
    const producto = req.body
    //Validar body ok
    
    console.log(producto)
    id = id + 1
    listaProductos.push({
        ...producto,
        id
    })
    res.status(202).json({
        payload: producto,
        mensaje: "Producto agregado con éxito!"
    })
})

//Actualizar producto pid (nunca actualizar o eliminar el id)
router.put('/:pid', (req, res) => {
    const prodId = req.params.pid
    const nuevosDatos = req.body
    //Validar body ok

    const prodIndex = listaProductos.findIndex(producto => producto.id == prodId)
    if (prodIndex >= 0){
        listaProductos[prodIndex] = nuevosDatos
        res.status(204).json({

            mensaje: "Producto modificado con éxito"
        })  
    }else{
        res.status(400).json({
            mensaje: "Producto con id {"+prodId+"} no encontrado."
        })
    }
   
})

//Eliminar producto pid
router.delete('/:pid', (req, res, next) => {
    const prodId = req.params.pid
    if (listaProductos.some(producto => producto.id == prodId)){
        const listaProductosFiltrada = listaProductos.filter(producto => producto.id != prodId)
        listaProductos = [...listaProductosFiltrada]
        next()
    }else{
        res.status(400).json({
            mensaje: "Producto con id {"+prodId+"} no encontrado."
        })
    }
}, (req,res)=>{
    res.json({
        mensaje: "Producto eliminado con éxito"
    })
})




export default router