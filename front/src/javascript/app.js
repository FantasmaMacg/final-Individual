const GERENTE_CODIGO = "12345";
let cesta = [];
let productos = []; // Definir la variable productos globalmente

$(document).ready(function () {
    $("#gerente-section").hide();

    // Iniciar sesión como gerente
    $("#form-login").on("submit", function (event) {
        event.preventDefault();
        iniciarSesion();
    });

    // Añadir un nuevo producto
    $("#form-nuevo-producto").on("submit", function (event) {
        event.preventDefault();
        añadirProducto();
    });

    cargarProductos(); // Cargar productos al inicio

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

    // Comprar todo desde la cesta
    $("#comprartodo").on("click", function () {
        comprarTodo();
    });
});

function agregarACesta(id) {
    const producto = productos.find(p => p.id === id);
    const productoEnCesta = cesta.find(p => p.id === id);

    if (productoEnCesta) {
        if (productoEnCesta.cantidad < producto.cantidad) {
            productoEnCesta.cantidad += 1;
        } else {
            mostrarAlerta("No puedes añadir más productos de los que hay en stock.", "warning");
            return; // Detener la función si no hay stock suficiente
        }
    } else {
        if (producto.cantidad > 0) {
            cesta.push({ ...producto, cantidad: 1 });
        } else {
            mostrarAlerta("Este producto está agotado.", "danger");
            return;
        }
    }

    producto.cantidad -= 1;
    actualizarCesta();
    actualizarContadorCesta();
    mostrarAlerta("Producto añadido a la cesta.", "success");

    
}


// Actualizar la lista de la cesta
function actualizarCesta() {
    const $cestaLista = $("#cesta-lista");
    $cestaLista.empty();

    let total = 0;

    cesta.forEach((producto) => {
        total += producto.precio * producto.cantidad;

        const productoCard = `
            <div class="d-flex justify-content-between mb-2">
                <span>${producto.nombre} (${producto.cantidad})</span>
                <span>€${(producto.precio * producto.cantidad).toFixed(2)}</span>
                <button class="btn btn-danger btn-sm" onclick="eliminarDeCesta(${producto.id})">Eliminar</button>
            </div>
        `;
        $cestaLista.append(productoCard);
    });

    $("#total-cesta").text(`Total: €${total.toFixed(2)}`);

    if (cesta.length > 0) {
        $("#comprar-todo-btn").show();
    } else {
        $("#comprar-todo-btn").hide();
    }
}

// Actualizar el contador de la cesta
function actualizarContadorCesta() {
    const totalArticulos = cesta.reduce((total, producto) => total + producto.cantidad, 0);
    $("#cart-count").text(totalArticulos);
}

// Eliminar un producto de la cesta
function eliminarDeCesta(id) {
    cesta = cesta.filter(p => p.id !== id);
    actualizarCesta();
    actualizarContadorCesta();
    mostrarAlerta("Producto eliminado de la cesta.", "warning");
}
// Iniciar sesión como gerente
function iniciarSesion() {
    const codigo = $("#codigo").val();

    if (codigo === GERENTE_CODIGO) {
        $("#login-section").hide();
        $("#gerente-section").show();
        mostrarAlerta("Sesión iniciada correctamente como gerente.", "success");
        cargarProductos(); // Recargar productos para mostrar las acciones de gerente
    } else {
        mostrarAlerta("Código incorrecto. Intenta nuevamente.", "danger");
    }
}

// Mostrar alertas
function mostrarAlerta(mensaje, tipo) {
    const alerta = $("#alerta");

    // Establecer el mensaje y el tipo de alerta
    alerta.text(mensaje);
    alerta.removeClass("alert-success alert-danger alert-warning alert-info"); // Eliminar clases previas
    alerta.addClass(`alert-${tipo}`); // Añadir la clase correspondiente al tipo de alerta

    // Mostrar la alerta
    alerta.removeClass("d-none");
    
    // Ocultar la alerta después de 3 segundos (opcional)
    setTimeout(() => {
        alerta.addClass("d-none");
    }, 3000);
}


// Cargar productos desde el backend
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

// Comprar un producto
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

// Comprar todos los productos de la cesta
async function comprarTodo() {
    const idsProductos = cesta.map(p => p.id);

    try {
        const response = await fetch("http://localhost:8080/productos/cesta/comprar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: idsProductos }),
        });

        if (response.ok) {
            mostrarAlerta("Compra de todos los productos realizada con éxito.", "success");

            cesta = [];
            actualizarCesta();
            actualizarContadorCesta();
            cargarProductos();
        } else {
            const errorMsg = await response.text();
            mostrarAlerta(`Error al comprar productos: ${errorMsg}`, "danger");
        }
    } catch (error) {
        console.error("Error al comprar productos:", error);
        mostrarAlerta("Error en la compra de productos.", "danger");
    }
}

// Añadir un nuevo producto
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
                cargarProductos();
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

// Obtener los datos de un producto para editarlo
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

// Guardar la edición de un producto
async function editarProducto() {
    const id = $("#editar-modal").data("id");
    const nombre = $("#editar-nombre").val();
    const descripcion = $("#editar-descripcion").val();
    const precio = parseFloat($("#editar-precio").val());
    const cantidad = parseInt($("#editar-cantidad").val());

    if (nombre && descripcion && !isNaN(precio) && !isNaN(cantidad)) {
        try {
            const response = await fetch(`http://localhost:8080/productos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, descripcion, precio, cantidad }),
            });

            if (response.ok) {
                mostrarAlerta("Producto editado.", "success");
                cargarProductos();
                $("#editar-modal").modal("hide");
            } else {
                const errorMsg = await response.text();
                mostrarAlerta(`Error al editar producto: ${errorMsg}`, "danger");
            }
        } catch (error) {
            console.error("Error al editar producto:", error);
            mostrarAlerta("Error al editar producto.", "danger");
        }
    }
}

// Eliminar un producto
async function eliminarProducto() {
    const id = $("#eliminar-modal").data("id");

    try {
        const response = await fetch(`http://localhost:8080/productos/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            mostrarAlerta("Producto eliminado.", "success");
            cargarProductos();
            $("#eliminar-modal").modal("hide");
        } else {
            const errorMsg = await response.text();
            mostrarAlerta(`Error al eliminar producto: ${errorMsg}`, "danger");
        }
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        mostrarAlerta("Error al eliminar producto.", "danger");
    }
}
