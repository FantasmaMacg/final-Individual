package es.santander.ascender.individual.controller;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.santander.ascender.individual.model.Producto;
import jakarta.validation.Valid;

@RestController
@RequestMapping(path = "/productos")
public class ProductoController {

    private List<Producto> cesta = new ArrayList<>();  
    private Map<Long, Producto> productos = new HashMap<>();

    public ProductoController() {
        productos.put(1L, new Producto(1L, "Escultura de madera", "Escultura tallada a mano en madera de nogal", 120.99f, 5));
        productos.put(2L, new Producto(2L, "Mesa rústica", "Mesa artesanal de madera reciclada, ideal para comedor", 350.75f, 3));
        productos.put(3L, new Producto(3L, "Jarrón cerámico", "Jarrón hecho a mano con acabados pintados", 45.50f, 10));
        productos.put(4L, new Producto(4L, "Lámpara de hierro forjado", "Lámpara artesanal con diseño vintage", 89.99f, 4));
        productos.put(5L, new Producto(5L, "Cuadro decorativo", "Pintura acrílica sobre lienzo con marco incluido", 75.25f, 6));
        productos.put(6L, new Producto(6L, "Silla de bambú", "Silla hecha a mano con bambú natural", 65.99f, 8));
        productos.put(7L, new Producto(7L, "Reloj de pared artesanal", "Reloj fabricado con madera y mecanismos reciclados", 39.99f, 7));
        productos.put(8L, new Producto(8L, "Alfombra tejida a mano", "Alfombra de lana con diseño étnico", 150.00f, 2));
        productos.put(9L, new Producto(9L, "Set de posavasos", "Set de 6 posavasos de cerámica pintados a mano", 25.99f, 15));
        productos.put(10L, new Producto(10L, "Banco de jardín", "Banco de madera tratada para exteriores", 299.50f, 3));
        productos.put(11L, new Producto(11L, "Macetero de barro", "Macetero redondo hecho de barro cocido", 18.99f, 12));
        productos.put(12L, new Producto(12L, "Espejo decorativo", "Espejo con marco de hierro forjado y acabados rústicos", 130.00f, 5));
        productos.put(13L, new Producto(13L, "Estantería flotante", "Estantería de madera para decoración de interiores", 45.00f, 9));
        productos.put(14L, new Producto(14L, "Caja decorativa", "Caja de madera para almacenamiento con detalles tallados", 29.99f, 10));
        productos.put(15L, new Producto(15L, "Portavelas artesanal", "Portavelas de cerámica con diseño minimalista", 15.50f, 20));
        productos.put(16L, new Producto(16L, "Cojines bordados", "Set de 2 cojines con bordados hechos a mano", 49.99f, 8));
        productos.put(17L, new Producto(17L, "Taburete rústico", "Taburete pequeño de madera reciclada", 59.99f, 6));
        productos.put(18L, new Producto(18L, "Puerta antigua decorativa", "Puerta de madera antigua restaurada como decoración", 550.00f, 1));
        productos.put(19L, new Producto(19L, "Llavero artesanal", "Llavero hecho con cuero y detalles metálicos", 9.99f, 30));
        productos.put(20L, new Producto(20L, "Camino de mesa", "Camino de mesa tejido a mano con diseños tradicionales", 25.75f, 10));
    }

    // Métodos para gestionar los productos y la cesta
    @GetMapping
    public HttpEntity<Collection<Producto>> get() {
        return ResponseEntity.ok().body(productos.values());
    }

    @GetMapping("/{id}")
    public HttpEntity<Producto> get(@PathVariable("id") long id) {
        if (!productos.containsKey(id)) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok().body(productos.get(id));
        }
    }

    @PostMapping
    public ResponseEntity<Producto> create(@RequestBody Producto producto) {
        //long cuenta = productos.values().size();
        long maxId = productos.keySet().stream().mapToLong(id -> id).max().orElse(0);
        producto.setId(maxId + 1);
        productos.put(producto.getId(), producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(producto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> update(@PathVariable("id") Long id, @Valid @RequestBody Producto productoActualizado) {
        Producto productoExistente = productos.get(id);

        if (productoExistente == null) {
            return ResponseEntity.notFound().build();
        }

        productoExistente.setNombre(productoActualizado.getNombre());
        productoExistente.setDescripcion(productoActualizado.getDescripcion());
        productoExistente.setPrecio(productoActualizado.getPrecio());
        productoExistente.setCantidad(productoActualizado.getCantidad());

        return ResponseEntity.ok(productoExistente);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        Producto productoExistente = productos.remove(id);
        if (productoExistente == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/compra")
    public ResponseEntity<String> comprarProducto(@PathVariable("id") Long id) {
        Producto producto = productos.get(id);

        if (producto == null) {
            return ResponseEntity.notFound().build();
        }

        if (producto.getCantidad() <= 0) {
            return ResponseEntity.badRequest().body("Producto sin stock disponible.");
        }

        producto.setCantidad(producto.getCantidad() - 1);

        return ResponseEntity.ok("Compra realizada con éxito. Producto: " + producto.getNombre());
    }

    @PostMapping("/{id}/añadir-cesta")
    public ResponseEntity<String> añadirACesta(@PathVariable("id") Long id) {
        Producto producto = productos.get(id);
        if (producto == null) {
            return ResponseEntity.notFound().build();
        }

        cesta.add(producto);
        return ResponseEntity.ok("Producto añadido a la cesta: " + producto.getNombre());
    }

    @GetMapping("/cesta")
    public ResponseEntity<List<Producto>> verCesta() {
        return ResponseEntity.ok(cesta);
    }

    @GetMapping("/cesta/total")
    public ResponseEntity<Float> calcularTotalCesta() {
        float total = (float) cesta.stream().mapToDouble(Producto::getPrecio).sum();
        return ResponseEntity.ok(total);
    }

    @PostMapping("/cesta/comprar")
    public ResponseEntity<String> comprarCesta() {
        if (cesta.isEmpty()) {
            return ResponseEntity.badRequest().body("La cesta está vacía.");
        }

        for (Producto producto : cesta) {
            if (producto.getCantidad() <= 0) {
                return ResponseEntity.badRequest().body("Producto sin stock disponible: " + producto.getNombre());
            }
            producto.setCantidad(producto.getCantidad() - 1);
        }

        cesta.clear();
        return ResponseEntity.ok("Compra realizada con éxito.");
    }
}
