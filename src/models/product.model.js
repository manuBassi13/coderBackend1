import mongoose, { Schema, model } from 'mongoose'
import paginate from 'mongoose-paginate-v2'

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

productSchema.plugin(paginate)

export const ProductModel = model('products', productSchema)