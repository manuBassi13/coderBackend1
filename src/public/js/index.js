
const socket = io()

socket.on('mostrar-productos', (listaProductos) => {
    const contenedorProductos = document.querySelector('#lista-productos-treal')   
    contenedorProductos.innerHTML = '<h2>Lista de productos:</h2>'
    listaProductos.forEach(producto => {
        const li = document.createElement('li')
        li.innerText = producto.title + ' - $' + producto.price
        contenedorProductos.appendChild(li)
    });
    socket.emit('traer-prod-id', listaProductos[0]._id)
})