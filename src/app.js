import express from "express"
import  ProductRoute  from './routes/products.router.js'
import ProductManager from "./Class/productManager.js"
import CartRoute from './routes/carts.routes.js'
import { __dirname } from "./utils.js"
import handlebars from 'express-handlebars'
import ViewRoute from './routes/views.routes.js'
import CategoryRoute from './routes/category.routes.js'
import { Server } from 'socket.io'
import mongoose from "mongoose"
import dotenv from "dotenv"

const app = express()
dotenv.config()

let listaProductos = []

export const productManager = new ProductManager(__dirname + '/db/products.json')

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

//MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))

app.use('/', ViewRoute)
app.use('/realtimeproducts', ViewRoute)
app.use('/api/products', ProductRoute)
app.use('/api/carts', CartRoute)
app.use('/api/categories', CategoryRoute)

const httpServer = app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
})

mongoose.connect(process.env.DB_URI, {dbName: 'CoderBackend1-Carrito'})
.then(()=>{
    console.log("Conectado a la Base de Datos");
    
})

export const io = new Server(httpServer)

io.on('connection', async (socket) => {
    console.log("Nueva conexión:", socket.id)
    
    listaProductos = await productManager.getProductList()
    io.emit('mostrar-productos', listaProductos)

    socket.on('traer-prod-id', async (pid) => {
        const prod = await productManager.getProductById(pid)
        socket.emit('datos-prod', prod)
    })

    socket.on('nuevo-producto', async (nuevoProd) => {
        await productManager.addProduct(nuevoProd)
        listaProductos = await productManager.getProductList()
        io.emit('mostrar-productos', listaProductos)
    })

    socket.on('actualizar-producto', async (nuevoProd) => {
        await productManager.updateProductById(nuevoProd.id, nuevoProd)
        listaProductos = await productManager.getProductList()
        io.emit('mostrar-productos', listaProductos)
    })

    socket.on('eliminar-producto', async (pid) => {
        await productManager.deleteProductById(pid)
        listaProductos = await productManager.getProductList()
        io.emit('mostrar-productos', listaProductos)
    })

})
