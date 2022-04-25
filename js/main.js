//VARIABLES
//Dom
const carritoBtn = document.querySelector('#carritoBtn'); //Boton que oculta el carrito en modo desktop
const DOMproductos = document.querySelector("#prodSection"); //Espacio del dom donde se renderizan los productos
const DOMcarrito = document.querySelector("#carritoSection"); //Seccion del carrito de compras
const DOMcarritoItems = document.querySelector("#carritoItems"); //Espacio del dom donde se renderizan los items agregados al carrito
const vaciarBtn = document.querySelector("#vaciarBtn"); //Boton para vaciar el carrito de compras
const comprarBtn = document.querySelector("#comprarBtn"); //Boton para comprar los items agregados al carrito
const DOMtotal = document.querySelector("#total"); //Precio total de los items del carrito
const DOMcontador = document.querySelector("#contador-dom"); //Espacio donde va el contador de items en el carrito
const DIVcontador = document.querySelector("#contador"); //contador de items en el carrito
//otras
const prodDB = [];
let carrito = [];


//FUNCIONES Y EVENTOS
carritoBtn.addEventListener("click", () => {
    DOMproductos.classList.toggle("noFull");
    DOMcarrito.classList.toggle("ocultar");
})

//obtener datos con fetch
const obtenerDatos = (URL) => {
    fetch(URL)
    .then((response) => response.json())
    .then(data => {
        for (const item of data) {
            prodDB.push(new Producto(item))
        }
    })
    .catch((error) => {
        DOMproductos.innerHTML = "<p>Lo sentimos hubo un error :(</p>" 
        DOMproductos.classList.toggle("fetchError")
        console.error(error);
    })
}

//mostrar datos en el dom
const renderizarObjetos = () => {
    for (const prod of prodDB) {
        const itemConStock = `<article class="prod_card">
        <img src="${prod.img1}" alt="" class="card_image">
        <img src="${prod.img2}" alt="" class="card_image card_image--hover">
        <h3 class="card_tittle text-center">${prod.nombre}</h3>
        <div class="card_info">
        <h4 class="card_price">$${prod.precio}</h4>
        <h4 class="card_stock">Disponible</h4>
        </div>
        <button marcador="${prod.id}" class="card_button btnAdd">Añadir al carrito</button>
        </article>`;

        const itemSinStock = `<article class="prod_card">
        <img src="${prod.img1}" alt="" class="card_image">
        <img src="${prod.img2}" alt="" class="card_image card_image--hover">
        <h3 class="card_tittle text-center">${prod.nombre}</h3>
        <div class="card_info">
        <h4 class="card_price">$${prod.precio}</h4>
        <h4 class="card_stock sin_stock">Sin stock</h4>
        </div>
        <button marcador="${prod.id}" class="card_button btnAdd">Añadir al carrito</button>
        </article>`;

        prod.stock > 0 ? DOMproductos.innerHTML += itemConStock : DOMproductos.innerHTML += itemSinStock;
    }
}

//agregar eventos al boton
const btnEvento = () => {
    const btnAdd = document.querySelectorAll(".btnAdd");
    btnAdd.forEach(btn => btn.addEventListener("click", agregarAlCarrito));
}

//agregar al carrito
function agregarAlCarrito(evento){
    carrito.push(evento.target.getAttribute("marcador"));
    renderizarCarrito();
    contadorItems();
}

//renderizar el carrito de compras
const renderizarCarrito = () => {
    DOMcarritoItems.innerText = "";

    //Eliminar elementos duplicados 
    const carritoSinDuplicados = [...new Set(carrito)];

    
    //generar nodos 
    carritoSinDuplicados.forEach((item) => {
        //obtener el producto de la Base de datos
        const itemBuscado = prodDB.filter((itemDB) => {
            return itemDB.id === item;
        });
        
        const productoUnidades = carrito.reduce((total, itemId) => {
            return itemId === item ? total +=1 : total;
        }, 0);
        //Creacion del nodo
        const nuevoNodo = `<article>
                                <img src="${itemBuscado[0].img1}" alt="" class="carrito_img">

                                <div class="datos_prod container">
                                    <h4 class="title">${itemBuscado[0].nombre}</h4>
                                    <p class="card_price">$${itemBuscado[0].precio}</p>

                                    <div>
                                        <p class="cantidad">Cantidad: ${productoUnidades}</p>  
                                    </div>

                                </div>
                            </article>`
        DOMcarritoItems.innerHTML += nuevoNodo;
    })

    DOMtotal.innerText = calcularTotal();
}

//Calcular total

const calcularTotal = () => {
    return carrito.reduce((total, item) => {
        const miItem = prodDB.filter((itemDB) => {
            return itemDB.id === item;
        });
        return total + miItem[0].precio;
    },0).toFixed(2);
}

//vaciar carrito con sweetalert 
const vaciarCarrito = () => {
    Swal.fire({
        title: 'Vaciar carrito',
        text: '¿Estas seguro de que quieres vaciar el carrito?',
        icon: 'warning',
        showDenyButton: true,
        confirmButtonText: 'Si, estoy seguro.',
        confirmButtonColor: '#000000',
        denyButtonText: 'Cancelar'
    })
    .then((result) => {
        result.isConfirmed && (carrito = []);
        renderizarCarrito();
        contadorItems();
    })
}

vaciarBtn.addEventListener('click', vaciarCarrito)

//boton comprar
const comprar = async () => {
    if(carrito != ""){
        const { value: email } = await Swal.fire({
            input: 'email',
            inputLabel: 'Tu dirección de email',
            inputPlaceholder: 'Ingrese su email',
            confirmButtonColor: '#000'
          })
          
          if (email) {
            Swal.fire({
                icon: 'success',
                text: 'Gracias por su pedido! Recibira un email para finalizar su compra :D', 
                confirmButtonColor: "#000"
            })
          }
        
          carrito  = [];
          renderizarCarrito();
          contadorItems();
    }else{
        Swal.fire({
            icon: 'warning',
            title: 'El carrito esta vacio!',
            text: 'Primero agrega algunos elementos antes de seguir con la compra',
            confirmButtonColor: "#000"
        })
    }
}

comprarBtn.addEventListener('click', comprar)

//agregar contador de items en el carrito en vista mobile
const contadorItems = () => {
    if(carrito.length != 0){
        contador.classList.add('contador-activado')
    }
    DOMcontador.innerText = carrito.length.toString()
}

// //app 
obtenerDatos('../database.json', {mode: 'no-cors'})
setTimeout(() => {
    renderizarObjetos()
    btnEvento()
    renderizarCarrito()
}, 1500)



