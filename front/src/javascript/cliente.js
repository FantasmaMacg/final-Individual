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
                    <button class="btn btn-success btn-sm" onclick="comprarProducto(${producto.id})">Comprar</button>
                </td>
            </tr>
        `;
        $tbody.append(row);
    });
}


async function comprarProducto(id) {
    const response = await fetch(`${apiUrl}/${id}/compra`, { method: "POST" });

    if (response.ok) {
        alert("¡Compra realizada con éxito!");
    } else {
        const errorMessage = await response.text();
        alert(`No se pudo realizar la compra: ${errorMessage}`);
    }

    cargarProductos(); 
}
