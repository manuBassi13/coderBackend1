import { Router } from "express"


const router = Router()


//Crear un nuevo carrito (id, products[])
router.post('/', (req, res) => {

})

//Listar productos del carrito cid
router.get('/:cid', (req, res) => {
    res.status(201).json({
        message: "Ok carts"
    })
})

//Agregar producto pid al carrito cid (pid, quantity) (Si el producto ya existe, incrementar qty)
router.post('/:cid/product/:pid', (req, res) => {

})

export default router