const deleteBtn = document.querySelector('#delete-product')
const addBtn = document.querySelector('#add-product')
const updBtn = document.querySelector('#update-product')
const updateSelect = document.querySelector('#update-select')
const deleteSelect = document.querySelector('#delete-select')
const updateProdItems = document.querySelector('#update-prod-items')

const title = document.querySelector('#add-title')
const description = document.querySelector('#add-description')
const code = document.querySelector('#add-code')
const price = document.querySelector('#add-price')
const status = document.querySelector('#add-status')
const stock = document.querySelector('#add-stock')
const category = document.querySelector('#add-category')
const thumbnail = document.querySelector('#add-thumbnail')

let utitle = document.querySelector('#u-title')
let udescription = document.querySelector('#u-description')
let ucode = document.querySelector('#u-code')
let uprice = document.querySelector('#u-price')
let ustatus = document.querySelector('#u-status')
let ustock = document.querySelector('#u-stock')
let ucategory = document.querySelector('#u-category')

let prodId = 0
let newProd = {}
let listaProductos = []


const socket = io()

function limpiarForms(){
    title.value = ""
    description.value = ""
    code.value = ""
    price.value = ""
    status.value = ""
    stock.value = ""
    category.value = ""
    thumbnail.value = ""
    utitle.value = ""
    udescription.value = ""
    ucode.value = ""
    uprice.value = ""
    ustatus.value = ""
    ustock.value = ""
    ucategory.value = ""
}

//ELIMINAR PRODUCTO
deleteBtn.addEventListener('click', () => {
    Swal.fire({
        title: "Estás seguro?",
        text: "No vas a poder revertirlo!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar producto!"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Eliminado!",
            text: "El producto ha sido eliminado.",
            icon: "success"
          });
          prodId = deleteSelect.value
          socket.emit('eliminar-producto', prodId)
        }
      });
})

//AGREGAR PRODUCTO
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
    //Validar newProd
    Swal.fire({
        title: "Producto agregado!",
        html: "Producto <b>"+title.value+"</b> Agregado con éxito!",
        icon: "success"
      });
    socket.emit('nuevo-producto', newProd)
})

//ACTUALIZAR PRODUCTO
updBtn.addEventListener('click', () => {
    updProd = {
        id: updateSelect.value,
        title: utitle.value == '' ? utitle.placeholder : utitle.value,
        description: udescription.value == '' ? udescription.placeholder : udescription.value,
        code: ucode.value == '' ? ucode.placeholder : ucode.value,
        price: uprice.value == '' ? uprice.placeholder : uprice.value,
        status: ustatus.value == '' ? ustatus.placeholder : ustatus.value,
        stock: ustock.value == '' ? ustock.placeholder : ustock.value,
        category: ucategory.value == '' ? ucategory.placeholder : ucategory.value
    }
    //Validar updProd
    Swal.fire({
        title: "Estás seguro?",
        text: "Revisa los datos:",
        html: 
        `<p>Título: `+updProd.title+`</p>`+
        `<p>Descripción: `+updProd.description+`</p>`+
        `<p>Código: `+updProd.code+`</p>`+
        `<p>Precio: `+updProd.price+`</p>`+
        `<p>Estado: `+updProd.status+`</p>`+
        `<p>Stock: `+updProd.stock+`</p>`+
        `<p>Categoría: `+updProd.category+`</p>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, actualizar!"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Actualizado!",
            text: "Tu producto ha sido actualizado.",
            icon: "success"
          });
        }
        socket.emit('actualizar-producto', updProd )
      });
})

//Buscar prod por id (Actualizar Producto)
updateSelect.addEventListener('change', () => {
    socket.emit('traer-prod-id', updateSelect.value)
})

//Rellenar inputs (Actualizar Producto)
socket.on('datos-prod', (prod) => {
        utitle.placeholder = prod.title
        udescription.placeholder = prod.description
        ucode.placeholder = prod.code
        uprice.placeholder = prod.price
        ustatus.placeholder = prod.status
        ustock.placeholder = prod.stock
        ucategory.placeholder = prod.category
})

//Limpiar opciones selects (actualizar prod y eliminar prod)
function limpiarSelects(){
    for (i = updateSelect.options.length; i>=0; i--){
        updateSelect.remove(i)
        deleteSelect.remove(i)
    }
}

function actualizarSelect(prodList){
    limpiarSelects()
    prodList.forEach(producto => {
        const opt = document.createElement('option')
        const opt2 = document.createElement('option')
        opt.value = producto.id
        opt2.value = producto.id
        opt.innerText = producto.title
        opt2.innerText = producto.title
        updateSelect.appendChild(opt)
        deleteSelect.appendChild(opt2)
    })  
}

socket.on('mostrar-productos', (listaProductos) => {
    const contenedorProductos = document.querySelector('#lista-productos-treal')   
    contenedorProductos.innerHTML = '<h2>Lista de productos:</h2>'
    listaProductos.forEach(producto => {
        const li = document.createElement('li')
        li.innerText = producto.title + ' - $' + producto.price
        contenedorProductos.appendChild(li)
    });
    limpiarForms()
    actualizarSelect(listaProductos)
    socket.emit('traer-prod-id', listaProductos[0].id)
})

