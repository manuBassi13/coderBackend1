const deleteBtn = document.querySelector('#delete-product')
const deleteId = document.querySelector('#delete-select')
const addBtn = document.querySelector('#add-product')
const updateProdId = document.querySelector('#update-select')
const updateProdItems = document.querySelector('#update-prod-items')

const title = document.querySelector('#add-title')
const description = document.querySelector('#add-description')
const code = document.querySelector('#add-code')
const price = document.querySelector('#add-price')
const status = document.querySelector('#add-status')
const stock = document.querySelector('#add-stock')
const category = document.querySelector('#add-category')
const thumbnail = document.querySelector('#add-thumbnail')
let prodId = 0
let newProd = {}

let listaProductos = []


const socket = io()
console.log(socket);

deleteBtn.addEventListener('click', () => {
    prodId = deleteId.value
    socket.emit('eliminar-producto', prodId)
})

addBtn.addEventListener('click', () => {
    newProd = {
        title: title.value,
        description: description.value,
        code: code.value,
        price: price.value,
        status: status.value,
        stock: stock.value,
        category: category.value,
        thumbnail: thumbnail.value
    }
    socket.emit('nuevo-producto', newProd)
})

socket.on('actualizar-prod', (prodId) => {

})

updateProdId.addEventListener('change', () => {
    socket.emit('traer-prod-id', updateProdId.value)

    socket.on('datos-prod', (prod) => {

        console.log(prod);
    })
    console.log("update: ",updateProdId.value);
    console.log(listaProductos)
})


socket.on('mostrar-productos', (listaProductos) => {
    const contenedorProductos = document.querySelector('#lista-productos-treal')   
    contenedorProductos.innerHTML = '<h2>Lista de productos:</h2>'
    listaProductos.forEach(producto => {
        const li = document.createElement('li')
        li.innerText = producto.title + ' - $' + producto.price
        contenedorProductos.appendChild(li)
    });
})

