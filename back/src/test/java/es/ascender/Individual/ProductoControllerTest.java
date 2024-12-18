package es.ascender.Individual;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import es.ascender.Individual.model.Producto;

import java.util.List;

public class ProductoControllerTest {

    private ProductoController controller;

    @BeforeEach
    void setUp() {
        controller = new ProductoController();
    }

    @Test
    void testAñadirACesta() {
        controller.añadirACesta(1L);
        List<Producto> cesta = controller.getCesta();
        assertEquals(1, cesta.size());
        assertEquals("Laptop HP Pavilion", cesta.get(0).getNombre());
    }

    @Test
    void testCalcularTotalCesta() {
        controller.añadirACesta(1L);
        controller.añadirACesta(2L);
        controller.calcularTotalCesta();
        float totalEsperado = 799.99f + 99.99f;
        float totalCalculado = (float) controller.getCesta().stream().mapToDouble(Producto::getPrecio).sum();
        assertEquals(totalEsperado, totalCalculado);
    }

    @Test
    void testComprarProducto() {
        controller.comprarProducto(1L);
        Producto producto = controller.getProducto(1L);
        assertEquals(9, producto.getCantidad()); // Cantidad inicial es 10, debe decrementar en 1
    }

    @Test
    void testComprarProductosCesta() {
        controller.añadirACesta(1L);
        controller.añadirACesta(2L);
        controller.comprarProductosCesta();
        assertTrue(controller.getCesta().isEmpty()); // La cesta debe vaciarse
        assertEquals(9, controller.getProducto(1L).getCantidad());
        assertEquals(4, controller.getProducto(2L).getCantidad());
    }

    @Test
    void testEliminarProducto() {
        controller.eliminarProducto(1L);
        assertNull(controller.getProducto(1L)); // Producto eliminado
    }

    @Test
    void testGetCesta() {
        controller.añadirACesta(1L);
        List<Producto> cesta = controller.getCesta();
        assertNotNull(cesta);
        assertEquals(1, cesta.size());
    }

    @Test
    void testGetProducto() {
        Producto producto = controller.getProducto(1L);
        assertNotNull(producto);
        assertEquals("Laptop HP Pavilion", producto.getNombre());
    }

    @Test
    void testListarProductos() {
        
        assertDoesNotThrow(() -> controller.listarProductos());
    }

    @Test
    void testModificarProducto() {
        controller.modificarProducto(1L, "Nuevo Laptop HP", "Nueva descripción", 899.99f, 20);
        Producto producto = controller.getProducto(1L);
        assertEquals("Nuevo Laptop HP", producto.getNombre());
        assertEquals("Nueva descripción", producto.getDescripcion());
        assertEquals(899.99f, producto.getPrecio());
        assertEquals(20, producto.getCantidad());
    }

    @Test
    void testVerCesta() {
        controller.añadirACesta(1L);
        controller.añadirACesta(2L);
        List<Producto> cesta = controller.getCesta();
        assertEquals(2, cesta.size());
    }

    @Test
    void testVerProducto() {
        Producto producto = controller.getProducto(1L);
        assertNotNull(producto);
        assertEquals("Laptop HP Pavilion", producto.getNombre());
    }
}
