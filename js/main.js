const contenedorProductos = document.getElementById("contenedorProductos");
const listadoProductos = "./json/productos.json";
let productos = [];

//Fetch
fetch(listadoProductos)
   .then(response => response.json())
   .then(datos => {

   productos = datos;
   cargarProductos(datos);
 })
   .catch(error => console.log(error))
   .finally(()=> console.log("Productos cargados"));

//Array Carrito
let carrito = [];

//LocalStorage
if(localStorage.getItem("carrito")){
  carrito = JSON.parse(localStorage.getItem("carrito"));
}

const cargarProductos = () => {
  productos.forEach( producto => {
      const card = document.createElement("div");
      card.classList.add("col-xl-3", "col-md-6", "col-xs-12");
      card.innerHTML = `
        <div class= "card"> 
          <img src=${producto.imagen} class= "card-img-top productoImg" alt=${producto.nombre}>
          <div class= "card-body">
            <h3> ${producto.titulo} </h3>
            <p> $${producto.precio} </p>
            <button class="btn" id="boton${producto.id}">Agregar al Carrito</button>
          </div>
        </div>
      `
      contenedorProductos.appendChild(card);
       // (Al agregar al carrito se muestra los productos agregados en la parte inferior)
      const boton = document.getElementById(`boton${producto.id}`);
      boton.addEventListener("click", () => {
        agregarAlCarrito(producto.id);
        mostrarCarrito();
      })
  })
}
cargarProductos();

//Agregar al carrito
const agregarAlCarrito = (id) => {
    const productoEnCarrito = carrito.find(producto => producto.id === id);
    if(productoEnCarrito) {
      productoEnCarrito.cantidad++;
      Toastify({
        text: "Producto Agregado ✨",
        gravity: "bottom",
        style: {
          background: "#D33E43",
        }
      }).showToast();
    } else {
      const producto = productos.find(producto => producto.id === id);
      carrito.push(producto)
      Toastify({
        text: "Producto Agregado ✨",
        gravity: "bottom",
        style: {
          background: "#D33E43",
        }
      }).showToast();
    }
   localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Ver Carrito
const contenedorCarrito = document.getElementById("contenedorCarrito");
const verCarrito = document.getElementById("verCarrito")

verCarrito.addEventListener("click", () => {
  mostrarCarrito();
})

//Mostrar Carrito
const mostrarCarrito = () => {
  contenedorCarrito.innerHTML = "";

  carrito.forEach(producto => {
      const card = document.createElement("div");
      card.classList.add("col-xl-3", "col-md-6", "col-xs-12");
      card.innerHTML = `
      <div class="carrito-producto">
          <img src="${producto.imagen}" class="carrito-producto-imagen" alt="${producto.nombre}">
          <div class="carrito-producto-titulo">
              <small>Título</small>
              <h3>${producto.titulo}</h3>
          </div>
          <div class="carrito-producto-cantidad">
              <small>Cantidad</small>
              <h3>${producto.cantidad}</h3>
          </div>
          <div class="carrito-producto-precio">
              <small>Precio</small>
              <h3>$${producto.precio}</h3>
          </div>
              <button class="carrito-producto-eliminar" id="eliminar${producto.id}"><i class="bi bi-trash-fill"></i>Eliminar</button>
      </div>
              `;
      contenedorCarrito.appendChild(card);
      //Eliminar: 
      const boton = document.getElementById(`eliminar${producto.id}`);
      boton.addEventListener("click", () => {
          eliminarDelCarrito(producto.id);
      })

  })
  calcularTotal();
}

// Eliminar un producto del carrito
const eliminarDelCarrito = (id) => {
  const producto = carrito.find(producto => producto.id === id);
  const indice = carrito.indexOf(producto);
  carrito.splice(indice, 1);
  //Resetear Cantidad al eliminar del carrito
  producto.cantidad = 1;
  mostrarCarrito();
}

// Vaciar el carrito
const vaciarCarrito = document.getElementById("vaciarCarrito");
vaciarCarrito.addEventListener("click", () => {
         vaciarTodoElCarrito();
})
const vaciarTodoElCarrito = () => {
      carrito = [];
      localStorage.clear();
      mostrarCarrito();
}


//Precio Total
const total = document.getElementById("total");
const calcularTotal = () => {
    let totalCompra = 0;
    carrito.forEach(producto => {
        totalCompra += producto.precio * producto.cantidad;
    })
    total.innerHTML = `Total: $${totalCompra}`;
}



