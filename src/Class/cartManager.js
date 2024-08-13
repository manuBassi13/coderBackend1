import fs from "node:fs"

class CartManager {
    constructor(path){
        this.path = path;
        this.carts = [];
        
    }

    async getCartById(cid){
        await this.getCarts()

        return this.carts.find(cart => cart.id == cid)
    }

    async getCarts(){
        try{
            const listCarts = await fs.promises.readFile(this.path, 'utf-8')
            this.carts = [...JSON.parse(listCarts).data] 
        } catch(err){
            if (err.code === 'ENOENT') throw ('File not found: ',err.path)
            else throw ('Error reading file: ', err)
        }
        return [...this.carts]
    }

    async createCart(products){
        await this.getCarts()
        let id = 1
        //Validar products
        this.carts.length != 0 ? id = this.carts[this.carts.length-1].id +1 : id
            
        this.carts.push({
                id,
                products: [...products]
            })

            await fs.promises.writeFile(this.path, JSON.stringify({ data: this.carts}))
        
    }

    async addProductToCart(cid, pid){
        this.carts = await this.getCarts()
        const cartsUpdated = this.carts.map((cart) => {
            if(cart.id != cid) return cart

            const indexProd = cart.products.findIndex(prod => prod.id == pid)
            if(indexProd == -1){
                cart.products.push({id: pid, quantity: 1})
                return cart
            }
            cart.products[indexProd] = {...cart.products[indexProd], quantity: cart.products[indexProd].quantity + 1}
            return cart
        })
        this.carts = [...cartsUpdated]
        await fs.promises.writeFile(this.path, JSON.stringify({ data: this.carts}))
    }

}

export default CartManager