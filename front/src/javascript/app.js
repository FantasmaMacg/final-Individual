const GERENTE_CODIGO = "12345";
let cesta = [];
let productos = [];
const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
let mostrarModal = true;

$(document).ready(function () {
    $("#gerente-section").hide();

    $("#login-btn").on("click", function (event) {

        if (mostrarModal) {
            loginModal.show();

        } else {
            $("#login-section").show();
            $("#gerente-section").hide();
            mostrarAlerta("Sesión cerrada correctamente.", "success");
            cargarProductos();
            document.getElementById("login-btn").textContent = "Iniciar Sesión";
            mostrarModal = true;
        }
    });

    $("#form-login").on("submit", function (event) {
        event.preventDefault();
        iniciarSesion();
    });

    $("#form-nuevo-producto").on("submit", function (event) {
        event.preventDefault();
        añadirProducto();
    });

    cargarProductos();


    $("#editar-modal").on("show.bs.modal", function (event) {
        const button = $(event.relatedTarget);
        const productoId = button.data("id");
        obtenerProducto(productoId);
        $("#editar-modal").data("id", productoId);
    });

    $("#eliminar-modal").on("show.bs.modal", function (event) {
        const button = $(event.relatedTarget);
        const productoId = button.data("id");
        $("#eliminar-modal").data("id", productoId);
    });


    $("#comprartodo").on("click", function () {
        comprarTodo();
    });
});

async function agregarACesta(id) {

    const response = await fetch(`/api/productos/${id}`);
    const producto = await response.json();

    if (!producto) {
        mostrarAlerta("El producto no existe o hubo un error al cargar la información.", "danger");
        return;
    }

    const productoEnCesta = cesta.find(p => p.id === id);

    if (productoEnCesta) {

        if (productoEnCesta.cantidad < producto.cantidad) {
            productoEnCesta.cantidad += 1;
        } else {
            mostrarAlerta("No puedes añadir más productos de los que hay en stock.", "warning");
            return;
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


    try {
        const response = await fetch(`api/productos/${producto.id}/añadir-cesta`, {
            method: "POST",
        });

        if (response.ok) {
            mostrarAlerta("Producto añadido a la cesta.", "success");
        } else {
            mostrarAlerta("Error al añadir el producto a la cesta.", "danger");
        }
    } catch (error) {
        console.error("Error al actualizar la cesta en el backend:", error);
        mostrarAlerta("Error al añadir el producto a la cesta.", "danger");
    }

    actualizarCesta();
    actualizarContadorCesta();
    mostrarAlerta("Producto añadido a la cesta.", "success");
}

function actualizarCesta() {
    const $cestaLista = $("#cesta-lista");
    $cestaLista.empty();

    let total = 0;

    cesta.forEach((producto) => {
        total += producto.precio * producto.cantidad;

        const productoCard = `
            <div class="d-flex justify-content-between mb-2">
                <span>${producto.nombre} (${producto.cantidad})</span>
                <span>${(producto.precio * producto.cantidad).toFixed(2)} €</span>
                <button class="btn btn-danger btn-sm" onclick="eliminarDeCesta(${producto.id})">Eliminar</button>
            </div>
        `;
        $cestaLista.append(productoCard);
    });

    $("#total-cesta").text(`Total: ${(total).toFixed(2)} €`);

    if (cesta.length > 0) {
        $("#comprar-todo-btn").show();
    } else {
        $("#comprar-todo-btn").hide();
    }
}

function actualizarContadorCesta() {
    const totalArticulos = cesta.reduce((total, producto) => total + producto.cantidad, 0);
    $("#cart-count").text(totalArticulos);
}

function eliminarDeCesta(id) {
    cesta = cesta.filter(p => p.id !== id);
    actualizarCesta();
    actualizarContadorCesta();
    mostrarAlerta("Producto eliminado de la cesta.", "warning");
}

function iniciarSesion() {
    const codigo = $("#codigo").val();

    if (codigo === GERENTE_CODIGO) {


        $("#login-section").hide();
        $("#gerente-section").show();
        mostrarAlerta("Sesión iniciada correctamente como gerente.", "success");
        cargarProductos();
        mostrarModal = false;


        document.getElementById("login-btn").textContent = "Cerrar";


    } else {
        mostrarAlerta("Código incorrecto. Intenta nuevamente.", "danger");
    }
}

function mostrarAlerta(mensaje, tipo) {
    const alerta = $("#alerta");


    alerta.text(mensaje);
    alerta.removeClass("alert-success alert-danger alert-warning alert-info");
    alerta.addClass(`alert-${tipo}`);


    alerta.removeClass("d-none");


    setTimeout(() => {
        alerta.addClass("d-none");
    }, 3000);
}

async function cargarProductos() {
    try {
        const response = await fetch("api/productos");
        productos = await response.json();

        const $productosLista = $("#productos-lista");
        $productosLista.empty();

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
               <div class="col-lg-3 col-md-4 col-sm-6 mb-4 producto-card">
             <div class="card shadow-sm">
                 <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text descripcion">${producto.descripcion}</p>
            <p class="card-text">
                <strong>${new Intl.NumberFormat('de-DE').format(producto.precio.toFixed(2))} €</strong>
            </p>
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
        const response = await fetch(`api/productos/${id}/compra`, { method: "POST" });
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

async function comprarTodo() {
    const idsProductos = cesta.map(p => p.id);

    try {
        const response = await fetch("api/productos/cesta/comprar", {
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

async function añadirProducto() {
    const nombre = $("#nuevo-nombre").val();
    const descripcion = $("#nuevo-descripcion").val();
    const precio = parseFloat($("#editar-precios").val());
    const cantidad = parseInt($("#editar-cantidades").val());

    if (nombre && descripcion && !isNaN(precio) && !isNaN(cantidad)) {
        try {
            const response = await fetch("api/productos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, descripcion, precio, cantidad }),
            });

            if (response.ok) {
                mostrarAlerta("Producto añadido.", "success");
                cargarProductos();
                $("#form-nuevo-producto")[0].reset();
                $("#nuevoProductoModal").modal("hide");
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
        const response = await fetch(`api/productos/${id}`);
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

async function editarProducto() {
    const id = $("#editar-modal").data("id");
    const nombre = $("#editar-nombre").val();
    const descripcion = $("#editar-descripcion").val();
    const precio = parseFloat($("#editar-precio").val());
    const cantidad = parseInt($("#editar-cantidad").val());

    if (nombre && descripcion && !isNaN(precio) && !isNaN(cantidad)) {
        try {
            const response = await fetch(`api/productos/${id}`, {
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

async function eliminarProducto() {
    const id = $("#eliminar-modal").data("id");

    try {
        const response = await fetch(`api/productos/${id}`, {
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
