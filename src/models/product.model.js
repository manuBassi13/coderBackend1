import mongoose, { Schema, model } from 'mongoose'

const productSchema = new Schema({
    title: String,
    code: {
        type: String,
        unique: true
    },
    price: Number,
    status: Boolean,
    stock: Number,
    categories: {
        default: [],
        type: [{
            category: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "categories"
            }
        }]
    },
    thumbnail: String
})

export const ProductModel = model('products', productSchema)