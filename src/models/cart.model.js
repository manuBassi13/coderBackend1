import mongoose, { Schema, model } from "mongoose";

const cartSchema = new Schema({
    products: {
        default: [],
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                quantity: Number
            }
        }]
    },
    user: {
        default: {},
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
})

export const CartModel = model('carts', cartSchema)