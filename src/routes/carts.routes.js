import { Router } from "express"
import CartManager from "../Class/cartManager.js"
import { __dirname } from "../utils.js"

const cartManager = new CartManager(__dirname + "/db/carts.json")
const router = Router()


//DONE
//Crear un nuevo carrito (id, products[])
router.post('/', async (req, res) => {
    const  products  = req.body
    await cartManager.createCart(products)

    res.status(200).json({
        message: "Carrito creado"
    })
})

//DONE
//Obtener carritos
router.get('/', async (req, res) => {
    console.log(req.query);
    const carts = await cartManager.getCarts();
    res.status(201).json({
        payload: [...carts],
        message: "Ok carts"
    })
})

//DONE
//Obtener productos del carrito cid
router.get('/:cid', async (req, res) => {
    const { cid } = req.params
    const cartFinded = await cartManager.getCartById(cid)
    cartFinded ?
    res.status(201).json({
        payload: cartFinded,
        message: "Carrito encontrado"
    }) :
    res.status(400).json({
        message: "Carrito no encontrado"
    })
})

//DONE
//Agregar producto pid al carrito cid (pid, quantity) (Si el producto ya existe, incrementar qty)
router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params
    const cartFinded = await cartManager.getCartById(cid)
    if (cartFinded){
        await cartManager.addProductToCart(cid, pid)
        res.status(200).json({
            message: "Producto agregado al carrito"
        })    
    } else {
        res.status(400).json({
            message: "Carrito no encontrado"
        })
    }
    


})

export default router