package es.ascender.Individual;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import es.ascender.Individual.model.Producto;

public class ProductoController {

    private List<Producto> cesta = new ArrayList<>();  // Lista para la cesta de compra
    private Map<Long, Producto> productos = new HashMap<>();

    public ProductoController() {
        productos.put(1L, new Producto(1, "Laptop HP Pavilion", "Laptop HP Pavilion 15 con Intel i7, 16GB RAM, 512GB SSD", 799.99f, 10));
        productos.put(2L, new Producto(2L, "Mouse Logitech MX Master 3", "Mouse ergonómico inalámbrico con Bluetooth", 99.99f, 5));
        productos.put(3L, new Producto(3L, "Teclado mecánico Corsair K95", "Teclado mecánico retroiluminado con switches Cherry MX", 159.99f, 3));
        productos.put(4L, new Producto(4L, "Monitor Samsung Odyssey", "Monitor curvo 27' Full HD con tasa de refresco de 144Hz", 289.99f, 7));
        productos.put(5L, new Producto(5L, "Auriculares Bose QuietComfort 35 II", "Auriculares inalámbricos con cancelación de ruido", 299.99f, 4));
        productos.put(6L, new Producto(6L, "SSD Samsung 970 EVO 1TB", "Disco SSD NVMe de 1TB para PC de alta velocidad", 149.99f, 6));
        productos.put(7L, new Producto(7L, "Placa base ASUS ROG Strix", "Placa base ATX para gamers, compatible con Intel y AMD", 249.99f, 8));
        productos.put(8L, new Producto(8L, "Tarjeta gráfica NVIDIA RTX 3080", "Tarjeta gráfica de alto rendimiento para juegos y edición de video", 699.99f, 2));
        productos.put(9L, new Producto(9L, "Smartphone Apple iPhone 14", "Smartphone de última generación con chip A15 Bionic", 1099.99f, 3));
        productos.put(10L, new Producto(10L, "Cámara web Logitech C920", "Cámara web Full HD con micrófono integrado", 69.99f, 9));
        productos.put(11L, new Producto(11L, "Impresora Epson EcoTank ET-2720", "Impresora multifunción con sistema de tanque de tinta recargable", 179.99f, 5));
        productos.put(12L, new Producto(12L, "Router TP-Link Archer AX6000", "Router Wi-Fi 6 de alto rendimiento con 8 puertos", 299.99f, 4));
        productos.put(13L, new Producto(13L, "Altavoces Bose Companion 2", "Altavoces de ordenador con sonido premium", 89.99f, 6));
        productos.put(14L, new Producto(14L, "Cable HDMI 4K", "Cable HDMI de alta velocidad para resolución 4K", 19.99f, 10));
        productos.put(15L, new Producto(15L, "Fuente de poder Corsair RM850x", "Fuente de alimentación de 850W con certificación 80 Plus Gold", 139.99f, 7));
        productos.put(16L, new Producto(16L, "Disco duro externo WD My Passport 2TB", "Disco duro externo portátil de 2TB", 89.99f, 8));
        productos.put(17L, new Producto(17L, "Teclado inalámbrico Logitech K780", "Teclado inalámbrico con soporte para múltiples dispositivos", 59.99f, 12));
        productos.put(18L, new Producto(18L, "Tarjeta madre MSI MAG B550 TOMAHAWK", "Placa base AM4 compatible con procesadores Ryzen 3000 y 5000", 129.99f, 9));
        productos.put(19L, new Producto(19L, "Windows 11 Home", "Sistema operativo Windows 11 Home para PC", 139.99f, 15));
        productos.put(20L, new Producto(20L, "Cargador portátil Anker PowerCore", "Batería externa de 10000mAh para cargar dispositivos móviles", 29.99f, 20));
    }

    // Método para obtener la cesta
    public List<Producto> getCesta() {
        return cesta;
    }

    // Método para obtener un producto por su ID
    public Producto getProducto(Long id) {
        return productos.get(id);
    }

    // Métodos adicionales (como los existentes en tu clase)
    public void listarProductos() {
        productos.forEach((id, producto) -> {
            System.out.println("ID: " + producto.getId() + ", Nombre: " + producto.getNombre() + ", Precio: " + producto.getPrecio());
        });
    }

    public void verProducto(Long id) {
        Producto producto = productos.get(id);
        if (producto != null) {
            System.out.println("Producto encontrado: " + producto.getNombre() + " - " + producto.getDescripcion());
        } else {
            System.out.println("Producto no encontrado.");
        }
    }

    public void comprarProducto(Long id) {
        Producto producto = productos.get(id);
        if (producto != null && producto.getCantidad() > 0) {
            producto.setCantidad(producto.getCantidad() - 1);
            System.out.println("Compra realizada con éxito. Producto: " + producto.getNombre());
        } else {
            System.out.println("Producto no disponible o sin stock.");
        }
    }

    public void añadirACesta(Long id) {
        Producto producto = productos.get(id);
        if (producto != null) {
            cesta.add(producto);
            System.out.println("Producto añadido a la cesta: " + producto.getNombre());
        } else {
            System.out.println("Producto no encontrado.");
        }
    }

    public void verCesta() {
        if (cesta.isEmpty()) {
            System.out.println("La cesta está vacía.");
        } else {
            System.out.println("Productos en la cesta:");
            cesta.forEach(producto -> System.out.println(producto.getNombre() + " - Precio: " + producto.getPrecio()));
        }
    }

    public void calcularTotalCesta() {
        float total = (float) cesta.stream().mapToDouble(Producto::getPrecio).sum();
        System.out.println("Total de la cesta: " + total);
    }

    public void eliminarProducto(Long id) {
        Producto producto = productos.remove(id);
        if (producto != null) {
            System.out.println("Producto eliminado: " + producto.getNombre());
        } else {
            System.out.println("Producto no encontrado.");
        }
    }

    public void modificarProducto(Long id, String nombre, String descripcion, float precio, int cantidad) {
        Producto producto = productos.get(id);
        if (producto != null) {
            producto.setNombre(nombre);
            producto.setDescripcion(descripcion);
            producto.setPrecio(precio);
            producto.setCantidad(cantidad);
            System.out.println("Producto modificado: " + producto.getNombre());
        } else {
            System.out.println("Producto no encontrado.");
        }
    }
    public void comprarProductosCesta() {
        if (cesta.isEmpty()) {
            System.out.println("La cesta está vacía, no hay productos para comprar.");
            return;
        }
    
        float totalCompra = 0;
        for (Producto producto : cesta) {
            if (producto.getCantidad() > 0) {
                producto.setCantidad(producto.getCantidad() - 1); // Reducir el stock en el catálogo
                totalCompra += producto.getPrecio(); // Sumar el precio al total de la compra
                System.out.println("Producto comprado: " + producto.getNombre());
            } else {
                System.out.println("Producto sin stock: " + producto.getNombre());
            }
        }
    
        // Limpiar la cesta después de la compra
        cesta.clear();
        System.out.println("Compra realizada con éxito. Total de la compra: " + totalCompra);
    }
    

}
