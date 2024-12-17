const GERENTE_CODIGO = "12345";
let cesta = [];
let productos = []; // Definir la variable productos globalmente

$(document).ready(function () {
    $("#gerente-section").hide();

    $("#form-login").on("submit", function (event) {
        event.preventDefault();
        iniciarSesion();
    });

    $("#form-nuevo-producto").on("submit", function (event) {
        event.preventDefault();
        añadirProducto();
    });

    cargarProductos();

    // Manejo de modales
    $("#editar-modal").on("show.bs.modal", function (event) {
        const button = $(event.relatedTarget); // Botón que activó el modal
        const productoId = button.data("id"); // Obtener el id del producto
        obtenerProducto(productoId);
        $("#editar-modal").data("id", productoId);
    });

    $("#eliminar-modal").on("show.bs.modal", function (event) {
        const button = $(event.relatedTarget); // Botón que activó el modal
        const productoId = button.data("id"); // Obtener el id del producto
        $("#eliminar-modal").data("id", productoId);
    });
});

function agregarACesta(id) {
    const producto = productos.find(p => p.id === id); // Buscar el producto por ID
    const productoEnCesta = cesta.find(p => p.id === id);

    if (productoEnCesta) {
        productoEnCesta.cantidad += 1; // Si el producto ya está, solo aumentamos la cantidad
    } else {
        cesta.push({ ...producto, cantidad: 1 }); // Si no está, lo agregamos a la cesta
    }

    // Restar uno de la cantidad disponible en el inventario
    producto.cantidad -= 1;

    actualizarCesta();
    mostrarAlerta("Producto añadido a la cesta.", "success");
}



function actualizarCesta() {
    const $cestaLista = $("#cesta-lista");
    $cestaLista.empty(); // Limpiar la lista de la cesta antes de añadir productos

    let total = 0;

    cesta.forEach((producto) => {
        total += producto.precio * producto.cantidad; // Calcular el total

        const productoCard = `
            <div class="d-flex justify-content-between mb-2">
                <span>${producto.nombre} (${producto.cantidad})</span>
                <span>€${(producto.precio * producto.cantidad).toFixed(2)}</span>
                <button class="btn btn-danger btn-sm" onclick="eliminarDeCesta(${producto.id})">Eliminar</button>
            </div>
        `;
        $cestaLista.append(productoCard);
    });

    // Mostrar el total
    $("#total-cesta").text(`Total: €${total.toFixed(2)}`);
}

function eliminarDeCesta(id) {
    cesta = cesta.filter(p => p.id !== id); // Filtrar el producto a eliminar
    actualizarCesta();
    mostrarAlerta("Producto eliminado de la cesta.", "warning");
}

function iniciarSesion() {
    const codigo = $("#codigo").val();

    if (codigo === GERENTE_CODIGO) {
        $("#login-section").hide(); // Ocultar la sección de login
        $("#gerente-section").show(); // Mostrar sección de gerente
        mostrarAlerta("Sesión iniciada correctamente como gerente.", "success");
        cargarProductos(); // Recargar productos para mostrar las acciones de gerente
    } else {
        mostrarAlerta("Código incorrecto. Intenta nuevamente.", "danger");
    }
}

function mostrarAlerta(mensaje, tipo) {
    const alerta = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    // Agregar la alerta al final del contenedor con id="alert-container"
    $("#alert-container").append(alerta); 
}


// Función para cargar productos desde el backend
async function cargarProductos() {
    try {
        const response = await fetch("http://localhost:8080/productos");
        productos = await response.json(); // Actualizar la lista de productos

        const $productosLista = $("#productos-lista");
        $productosLista.empty(); // Limpiar la lista antes de añadir nuevos productos

        productos.forEach((producto) => {
            const accionesCliente = producto.cantidad > 0
                ? `<button class="btn btn-success btn-sm" onclick="comprarProducto(${producto.id})">Comprar</button>
                   <button class="btn btn-primary btn-sm" onclick="agregarACesta(${producto.id})">Añadir a la Cesta</button>`
                : '<span class="text-danger">Agotado</span>';

            const accionesGerente = `
                <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#editar-modal" data-id="${producto.id}">Editar</button>
                <button class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#eliminar-modal" data-id="${producto.id}">Eliminar</button>
            `;

            const acciones = `
                ${accionesCliente}
                ${$("#gerente-section").is(":visible") ? accionesGerente : ""}
            `;

            const productoCard = `
                <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text">${producto.descripcion}</p>
                            <p class="card-text"><strong>€${producto.precio.toFixed(2)}</strong></p>
                            <p class="card-text">Cantidad: ${producto.cantidad}</p>
                            <div class="d-grid gap-2">
                                ${acciones}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            $productosLista.append(productoCard);
        });

    } catch (error) {
        console.error("Error al cargar productos:", error);
        mostrarAlerta("No se pudieron cargar los productos.", "danger");
    }
}

async function comprarProducto(id) {
    try {
        const response = await fetch(`http://localhost:8080/productos/${id}/compra`, { method: "POST" });
        if (response.ok) {
            mostrarAlerta("Compra realizada con éxito.", "success");
            cargarProductos();
        } else {
            const errorMsg = await response.text();
            mostrarAlerta(`Error: ${errorMsg}`, "danger");
        }
    } catch (error) {
        console.error("Error en la compra:", error);
        mostrarAlerta("Error en la compra.", "danger");
    }
}

async function añadirProducto() {
    const nombre = $("#nuevo-nombre").val();
    const descripcion = $("#nuevo-descripcion").val();
    const precio = parseFloat($("#nuevo-precio").val());
    const cantidad = parseInt($("#nuevo-cantidad").val());

    if (nombre && descripcion && !isNaN(precio) && !isNaN(cantidad)) {
        try {
            const response = await fetch("http://localhost:8080/productos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, descripcion, precio, cantidad }),
            });

            if (response.ok) {
                mostrarAlerta("Producto añadido.", "success");
                cargarProductos(); // Recarga los productos
                $("#form-nuevo-producto")[0].reset(); // Resetea el formulario
                $("#nuevoProductoModal").modal("hide"); // Cierra el modal
            } else {
                const errorMsg = await response.text();
                mostrarAlerta(`Error al añadir producto: ${errorMsg}`, "danger");
            }
            
        } catch (error) {
            console.error("Error al añadir producto:", error);
            mostrarAlerta("Error al añadir producto.", "danger");
        }
    }
}

async function obtenerProducto(id) {
    try {
        const response = await fetch(`http://localhost:8080/productos/${id}`);
        const producto = await response.json();

        $("#editar-nombre").val(producto.nombre);
        $("#editar-descripcion").val(producto.descripcion);
        $("#editar-precio").val(producto.precio);
        $("#editar-cantidad").val(producto.cantidad);
    } catch (error) {
        console.error("Error al obtener producto:", error);
        mostrarAlerta("Error al obtener los datos del producto.", "danger");
    }
}
// Función para comprar todos los productos en la cesta
async function comprarCesta() {
    if (cesta.length === 0) {
        mostrarAlerta("No hay productos en la cesta para comprar.", "warning");
        return;
    }

    // Recorremos cada producto en la cesta
    for (let producto of cesta) {
        try {
            const response = await fetch(`http://localhost:8080/productos/${producto.id}/compra`, { method: "POST" });

            if (!response.ok) {
                const errorMsg = await response.text();
                mostrarAlerta(`Error al comprar ${producto.nombre}: ${errorMsg}`, "danger");
                return; // Si algo falla, detenemos la compra de los demás productos
            }

            // Si la compra es exitosa, restamos la cantidad en el inventario
            producto.cantidad -= 1;
        } catch (error) {
            console.error("Error al comprar:", error);
            mostrarAlerta("Error al realizar la compra.", "danger");
            return; // Si algo falla, detenemos la compra de los demás productos
        }
    }

    // Actualizamos la lista de productos y la cesta
    cargarProductos();
    cesta = []; // Limpiamos la cesta después de la compra
    actualizarCesta();
    mostrarAlerta("Compra realizada con éxito.", "success");
}function actualizarCesta() {
    const $cestaLista = $("#cesta-lista");
    $cestaLista.empty(); // Limpiar la lista de la cesta antes de añadir productos

    let total = 0;

    cesta.forEach((producto) => {
        total += producto.precio * producto.cantidad; // Calcular el total

        const productoCard = `
            <div class="d-flex justify-content-between mb-2">
                <span>${producto.nombre} (${producto.cantidad})</span>
                <span>€${(producto.precio * producto.cantidad).toFixed(2)}</span>
                <button class="btn btn-danger btn-sm" onclick="eliminarDeCesta(${producto.id})">Eliminar</button>
            </div>
        `;
        $cestaLista.append(productoCard);
    });

    // Mostrar el total
    $("#total-cesta").text(`Total: €${total.toFixed(2)}`);

    // Mostrar el botón de "Comprar Todo" si hay productos en la cesta
    if (cesta.length > 0) {
        $("#comprar-todo-btn").show();
    } else {
        $("#comprar-todo-btn").hide();
    }
}



async function guardarEdicionProducto() {
    const id = $("#editar-modal").data("id");
    const nuevoNombre = $("#editar-nombre").val();
    const nuevaDescripcion = $("#editar-descripcion").val();
    const nuevoPrecio = parseFloat($("#editar-precio").val());
    const nuevaCantidad = parseInt($("#editar-cantidad").val());

    if (nuevoNombre && nuevaDescripcion && !isNaN(nuevoPrecio) && !isNaN(nuevaCantidad)) {
        try {
            const response = await fetch(`http://localhost:8080/productos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre: nuevoNombre,
                    descripcion: nuevaDescripcion,
                    precio: nuevoPrecio,
                    cantidad: nuevaCantidad,
                }),
            });

            if (response.ok) {
                mostrarAlerta("Producto actualizado.", "success");
                cargarProductos();
                $("#editar-modal").modal("hide");
            } else {
                mostrarAlerta("Error al actualizar el producto.", "danger");
            }
        } catch (error) {
            console.error("Error al editar producto:", error);
            mostrarAlerta("Error al editar producto.", "danger");
        }
    }
}

async function eliminarProducto() {
    const id = $("#eliminar-modal").data("id");

    try {
        const response = await fetch(`http://localhost:8080/productos/${id}`, { method: "DELETE" });

        if (response.ok) {
            mostrarAlerta("Producto eliminado.", "success");
            cargarProductos();
            $("#eliminar-modal").modal("hide");
        } else {
            mostrarAlerta("Error al eliminar el producto.", "danger");
        }
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        mostrarAlerta("Error al eliminar producto.", "danger");
    }
}
