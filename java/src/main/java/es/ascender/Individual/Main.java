package es.ascender.Individual;

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        ProductoController controller = new ProductoController();

        while (true) {
            System.out.println("\n--- Menú ---");
            System.out.println("1. Listar productos");
            System.out.println("2. Ver producto por ID");
            System.out.println("3. Añadir producto a la cesta");
            System.out.println("4. Ver cesta");
            System.out.println("5. Comprar productos en la cesta");
            System.out.println("6. Calcular total de la cesta");
            System.out.println("7. Comprar producto");
            System.out.println("8. Eliminar producto del catálogo");
            System.out.println("9. Modificar producto del catálogo");
            System.out.println("10. Salir");
            System.out.print("Selecciona una opción: ");
            
            int opcion = scanner.nextInt();
            scanner.nextLine();  

            switch (opcion) {
                case 1:
                    controller.listarProductos();
                    break;
                case 2:
                    System.out.print("Introduce el ID del producto: ");
                    Long idVerProducto = scanner.nextLong();
                    controller.verProducto(idVerProducto);
                    break;
                case 3:
                    System.out.print("Introduce el ID del producto para añadir a la cesta: ");
                    Long idAñadir = scanner.nextLong();
                    controller.añadirACesta(idAñadir);
                    break;
                case 4:
                    controller.verCesta();
                    break;
                case 5:
                    controller.comprarProductosCesta(); 
                    break;
                case 6:
                    controller.calcularTotalCesta();
                    break;
                case 7:
                    System.out.print("Introduce el ID del producto para comprar: ");
                    Long idComprar = scanner.nextLong();
                    controller.comprarProducto(idComprar);
                    break;
                case 8:
                    System.out.print("Introduce el ID del producto para eliminar del catálogo: ");
                    Long idEliminarCatalogo = scanner.nextLong();
                    controller.eliminarProducto(idEliminarCatalogo);
                    break;
                case 9:
                    System.out.print("Introduce el ID del producto para modificar en el catálogo: ");
                    Long idModificarCatalogo = scanner.nextLong();
                    scanner.nextLine(); // Consumir el salto de línea
                    System.out.print("Introduce el nuevo nombre: ");
                    String nuevoNombre = scanner.nextLine();
                    System.out.print("Introduce la nueva descripción: ");
                    String nuevaDescripcion = scanner.nextLine();
                    System.out.print("Introduce el nuevo precio: ");
                    float nuevoPrecio = scanner.nextFloat();
                    System.out.print("Introduce la nueva cantidad: ");
                    int nuevaCantidad = scanner.nextInt();
                    controller.modificarProducto(idModificarCatalogo, nuevoNombre, nuevaDescripcion, nuevoPrecio, nuevaCantidad);
                    break;
                case 10:
                    System.out.println("¡Hasta luego!");
                    scanner.close();
                    return;
                default:
                    System.out.println("Opción no válida. Intenta de nuevo.");
            }
        }
    }
}
