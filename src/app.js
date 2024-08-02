import express from "express"
import  ProductRoute  from './routes/products.router.js'
import ProductManager from "./Class/productManager.js"
import CartRoute from './routes/carts.routes.js'
import { __dirname } from "./utils.js"
import handlebars from 'express-handlebars'
import ViewRoute from './routes/views.routes.js'
import { Server } from 'socket.io'


const app = express()
const PORT = 8080;
let listaProductos = []
//let pid = 0
export const productManager = new ProductManager(__dirname + '/db/products.json')

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')


//MIDDLEWARES
app.use(express.json()) //Para reconocer JSON en el body
app.use(express.urlencoded({extended: true}))   //Para recibir y comprender formularios
app.use(express.static(__dirname + '/public'))  //Carpeta public como estática


app.use('/', ViewRoute)
app.use('/realtimeproducts', ViewRoute)
app.use('/api/products', ProductRoute)
app.use('/api/carts', CartRoute)


const httpServer = app.listen(PORT, () => {
    console.log("Servidor listo");
})

export const io = new Server(httpServer)



io.on('connection', async (socket) => {
    console.log("Nueva conexión:", socket.id)
    
    listaProductos = await productManager.getProductList()
    io.emit('mostrar-productos', listaProductos)

    // socket.on('traer-prod-id', async (pid) => {
    //     const prod = await productManager.getProductById(pid)
    //     socket.emit('datos-prod', prod)
    // })

    socket.on('nuevo-producto', async (nuevoProd) => {
        await productManager.addProduct(nuevoProd)
        listaProductos = await productManager.getProductList()
        io.emit('mostrar-productos', listaProductos)
    })

    socket.on('eliminar-producto', async (pid) => {
        await productManager.deleteProductById(pid)
        listaProductos = await productManager.getProductList()
        io.emit('mostrar-productos', listaProductos)
    })


})
