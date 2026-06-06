import PRODUCTOS_INICIALES from "../constants/productos";
import { categoriaTieneStock } from "../constants/categorias";

export function normalizarInventarioVentas(guardado) {
  const resultado = {};

  Object.entries(PRODUCTOS_INICIALES).forEach(([categoria, productosDefault]) => {
    const productosGuardados = guardado?.[categoria];

    if (categoriaTieneStock(categoria)) {
      resultado[categoria] = productosDefault.map((producto) => {
        const guardadoItem = productosGuardados?.find(
          (item) => item.nombre === producto.nombre
        );

        return {
          nombre: producto.nombre,
          precio: producto.precio,
          stock: guardadoItem?.stock ?? producto.stock ?? 0,
        };
      });
    } else {
      resultado[categoria] = productosDefault.map((producto) => ({
        nombre: producto.nombre,
        precio: producto.precio,
      }));
    }
  });

  return resultado;
}
