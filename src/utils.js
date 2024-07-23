import multer from "multer"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import fs from "node:fs"

const __filename = fileURLToPath(import.meta.url)

//Ruta Absoluta de /src
export const __dirname = dirname(__filename)



export async function buscarProductosDB(){
    try{
        const listaProductos = await fs.promises.readFile(__dirname+'/db/products.json', 'utf-8') 
        return listaProductos
    }catch(e){
        console.log("Falla al retornar productos.")
    }   
}

export async function buscarCarritosDB(){
    try{
        const listaCarritos = await fs.promises.readFile(__dirname+'/db/carts.json', 'utf-8') 
        return listaCarritos
    }catch(e){
        console.log("Falla al retornar carritos.")
    }
}


//buscarCarritosDB()
