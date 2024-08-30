import { Router } from "express"
import CartManager from "../Class/cartManager.js"
import { CartModel } from "../models/cart.model.js"
import { __dirname } from "../utils.js"

const cartManager = new CartManager(__dirname + "/db/carts.json")
const router = Router()


router.post('/', async (req, res) => {
    const newCart = await CartModel.create({
        products: []
    })

    res.status(201).json({
        message: "Carrito creado",
        cart: newCart
    })
})


router.get('/', async (req, res) => {
    const carts = await cartManager.getCarts();
    carts.length != 0 ?
    res.status(200).json({
        payload: [...carts],
        message: "Ok carts"
    }) :
    res.status(404).json({
        message: "No existen carritos"
    })
})

//Traer Cart por CID
router.get('/:cid', async (req, res) => {
    const { cid } = req.params
    try{
        const cartFinded = await CartModel.findById(cid).populate('products.product')

        cartFinded ?
        res.status(200).json({
            message: "Carrito encontrado",
            productList: cartFinded.products
        }) :
        res.status(400).json({message: "Carrito no encontrado"})
    }
    catch(e){
        res.status(404).json({message: "Error al traer carrito"})
    }
})

router.put('/:cid', async (req, res) => {
    const { cid } = req.params
    const { products } = req.body
    try{
        
        console.log("products-",products);
        
        const cartFinded = await CartModel.findById(cid).lean()
        console.log("cartfindedProd",cartFinded.products);
        
        if(!cartFinded) res.status(404).json({message: "Carrito no encontrado1"})
            console.log("cartFinded-",cartFinded);
            
        const newCart = {
            ...cartFinded,
            products
        }
        console.log("nuevo carrito",newCart);
        
        const cartUpdated = await CartModel.findByIdAndUpdate(cid, newCart, {new: true}).populate('products.product')

        res.status(201).json({
            message: "Carrito actualizado",
            cart: cartUpdated
        })
    }
    catch(e){
        res.status(404).json({message: "Carrito no encontrado2"})
    }
})

//Agregar Product PID a Cart CID
router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params

    const cartFinded = await CartModel.findById(cid)

    if(!cartFinded) res.status(404).json({message:"Carrito no encontrado"})

    const indexProd = cartFinded.products.findIndex(prod => prod.product.toString() === pid)
    if(indexProd === -1){
        cartFinded.products.push({product: pid, quantity: 1})
    } else{
        cartFinded.products[indexProd] = {product: cartFinded.products[indexProd].product, quantity: cartFinded.products[indexProd].quantity + 1}
    }

    const cartUpdated = await CartModel.findByIdAndUpdate(cid, cartFinded, { new: true }).populate('products.product')
    res.status(201).json({
        message: "Producto agregado con éxito!",
        cart: cartUpdated
    })
    
})

router.put('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params
    const { quantity } = req.body
    try{
        const cartFinded = await CartModel.findById(cid).lean()
        if(!cartFinded) res.status(404).json({message: "Carrito no encontrado"});
        
        const indexProd = cartFinded.products.findIndex(prod => prod.product.toString() === pid)

        cartFinded.products[indexProd] = {...cartFinded.products[indexProd], quantity }

        const cartUpdated = await CartModel.findByIdAndUpdate(cid, cartFinded, {new: true}).populate('products.product')

        res.status(201).json({
            message: "Cantidad de producto '"+cartFinded.products[indexProd].title +"' actualizado con éxito",
            cart: cartUpdated
        })
    }
    catch(e){
        res.status(404).json({message: "Carrito no encontrado2"})
    }

})


export default router