const apiUrl = "http://localhost:8080/productos";

$(document).ready(function() {
    cargarProductos();
});


async function cargarProductos() {
    const response = await fetch(apiUrl);
    const productos = await response.json();

    const $tbody = $("#productos-table tbody");
    $tbody.empty(); 

    productos.forEach(producto => {
        const row = `
            <tr>
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.descripcion}</td>
                <td>€${producto.precio.toFixed(2)}</td>
                <td>${producto.cantidad}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarProducto(${producto.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${producto.id})">Eliminar</button>
                </td>
            </tr>
        `;
        $tbody.append(row);
    });
}


$("#form-nuevo-producto").submit(async function(event) {
    event.preventDefault();

    const nombre = $("#nombre").val();
    const descripcion = $("#descripcion").val();
    const precio = parseFloat($("#precio").val());
    const cantidad = parseInt($("#cantidad").val());

    const producto = { nombre, descripcion, precio, cantidad };

   
    await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto)
    });

   
    cargarProductos();

    
    $("#form-nuevo-producto")[0].reset();
});


async function eliminarProducto(id) {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
        await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
        cargarProductos();
    }
}


async function editarProducto(id) {
    const response = await fetch(`${apiUrl}/${id}`);
    const producto = await response.json();

    $("#nombre").val(producto.nombre);
    $("#descripcion").val(producto.descripcion);
    $("#precio").val(producto.precio);
    $("#cantidad").val(producto.cantidad);
}
