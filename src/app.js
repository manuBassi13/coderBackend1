import express from "express"
import  ProductRoute  from './routes/products.router.js'
import CartRoute from './routes/carts.routes.js'
import { __dirname } from "./utils.js"



const app = express()

//MIDDLEWARES
app.use(express.json()) //Para reconocer JSON en el body
app.use(express.urlencoded({extended: true}))   //Para recibir y comprender formularios
app.use(express.static(__dirname + '/public'))  //Carpeta public como estática


app.use('/api/products', ProductRoute)

app.use('/api/carts', CartRoute)




app.listen(8080, ()=>{
    console.log("Servidor listo");
})
