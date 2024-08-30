import { Schema, model } from "mongoose"

const categoriasSchema = new Schema({
    description: String
})


export const CategoriasModel = model('categories', categoriasSchema)