import express from "express"
import  ProductRoute  from './routes/products.router.js'
import ProductManager from "./Class/productManager.js"
import CartRoute from './routes/carts.routes.js'
import { __dirname } from "./utils.js"
import handlebars from 'express-handlebars'
import ViewRoute from './routes/views.routes.js'
import { Server } from 'socket.io'
import mongoose from "mongoose"


const app = express()
const PORT = 8080;
let listaProductos = []
//let pid = 0
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


const httpServer = app.listen(PORT, () => {
    console.log("Servidor listo");
})

const pw = 'o0dSKPSHEBXOCbsq'
const conectString = 'mongodb+srv://manuelbassi96:'+pw+'@coderbackend1.r361g.mongodb.net/?retryWrites=true&w=majority&appName=CoderBackend1'
mongoose.connect(conectString, {dbName: 'CoderBackend1-Carrito'})
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
