import fs from "node:fs"

class ProductManager {
    constructor(path){
        this.path = path;
        this.productList = [];
        this.id = 0;
    }
    
    async getProductById(pid){
        await this.getProductList()

        return this.productList.find(product => product.id == pid)
    }

    async getProductList(){
        try{
            const list = await fs.promises.readFile(this.path, 'utf-8')
            this.productList = [...JSON.parse(list).data]
        } catch (err){
            (err.code === 'ENOENT') ?
                console.error('File not found: ',err.path) :
                console.error('Error reading file: ', err)
        }
        return [...this.productList]
    }

    async addProduct(product){
        await this.getProductList()
        this.id = this.productList[this.productList.length-1].id +1
        this.productList.push({
            id: this.id,
            ...product})
        await fs.promises.writeFile(this.path, JSON.stringify({data : this.productList}))
    }

    async updateProductById(pid, newData){
        await this.getProductList()

        const productListUpdated = this.productList.map((prod) => {
            if(prod.id != pid) return prod
            else {
                prod = {
                    //Para pisar sólo los datos modificados y mantener el id
                    ...prod,
                    ...newData,
                    id: prod.id
                }
                return prod
            }
        })
        this.productList = [...productListUpdated]
        await fs.promises.writeFile(this.path, JSON.stringify({ data: this.productList }))
    }

    async deleteProductById(pid){
        await this.getProductList()
        const indexProd = this.productList.findIndex(prod => prod.id == pid)
        this.productList.splice(indexProd, 1)
        await fs.promises.writeFile(this.path, JSON.stringify({data: this.productList}))
    }

}

export default ProductManager;