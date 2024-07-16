import { Router } from "express"


const router = Router()

//Obtener todos los productos (incluir ?limit)
router.get('/', (req, res) => {
    res.status(201).json({
        payload: [...ListProducts],
        message: "Ok products"
    })
})

//Obtener producto pid
router.get('/:pid', (req, res) => {
    res.status(201)
})

//Agregar producto (id, title, description, code, price, status, stock, category, thumbnails)
router.post('/', (req, res) => {

})

//Actualizar producto pid (nunca actualizar o eliminar el id)
router.put('/:pid', (req, res) => {

})

//Eliminar producto pid
router.delete('/:pid', (req, res) => {

})



export default router