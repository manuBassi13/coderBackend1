import { ProductModel } from "../models/product.model.js"
import { paginate } from "mongoose-paginate-v2";

class ProductManager {
    constructor(){
        this.productList = [];
        this.product = {}
    }
    
    async getProductById(pid){
        //this.product = await ProductModel.findById(pid)
        this.product = await ProductModel.find({_id: pid}).populate('categories.category') 
        return this.product
    }

    async getProductList(){
        try{
            this.productList = await ProductModel.find()
        } catch (err){
            if(err.code === 'ENOENT') throw ('File not found: ',err.path);
            else throw ('Error reading file: ', err);
        }
        
        return this.productList
    }

    async addProduct(product){
        //Validar product
        const result = await ProductModel.create(product)
        return result
    }

    async updateProductById(pid, newData){
        //Validar newData
        const productUpdated = await ProductModel.findByIdAndUpdate(pid, {
            ...newData
        }, {new: true})
        return productUpdated
    }

    async deleteProductById(pid){
        const result = await ProductModel.findByIdAndDelete(pid)
        return result
    }

}

export default ProductManager;