import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/layout/PageHeader";
import CategoryButtons from "../components/ventas/CategoryButtons";
import ProductGrid from "../components/ventas/ProductGrid";
import Carrito from "../components/ventas/Carrito";
import Card from "../components/ui/Card";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { categoriaTieneStock } from "../constants/categorias";
import PRODUCTOS_INICIALES from "../constants/productos";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { formatSoles } from "../utils/currency";
import { formatDateTime } from "../utils/date";
import { normalizarInventarioVentas } from "../utils/inventarioVentas";

export default function Ventas() {
  const [categoria, setCategoria] = useState("hamburguesas");
  const [carrito, setCarrito] = useState([]);
  const [ventas, setVentas] = useLocalStorage(STORAGE_KEYS.VENTAS, []);
  const [inventarioGuardado, setInventarioGuardado] = useLocalStorage(
    STORAGE_KEYS.INVENTARIO,
    PRODUCTOS_INICIALES
  );

  const inventario = useMemo(
    () => normalizarInventarioVentas(inventarioGuardado),
    [inventarioGuardado]
  );

  useEffect(() => {
    const normalizado = normalizarInventarioVentas(inventarioGuardado);
    const necesitaActualizar =
      JSON.stringify(normalizado) !== JSON.stringify(inventarioGuardado);

    if (necesitaActualizar) {
      setInventarioGuardado(normalizado);
    }
  }, [inventarioGuardado, setInventarioGuardado]);

  const agregarProducto = (producto) => {
    if (categoriaTieneStock(categoria) && producto.stock <= 0) return;

    if (categoriaTieneStock(categoria)) {
      const nuevoInventario = { ...inventario };
      nuevoInventario[categoria] = nuevoInventario[categoria].map((item) =>
        item.nombre === producto.nombre
          ? { ...item, stock: item.stock - 1 }
          : item
      );
      setInventarioGuardado(nuevoInventario);
    }

    setCarrito((prev) => [...prev, producto]);
  };

  const eliminarProducto = (index) => {
    const producto = carrito[index];
    const nuevoCarrito = carrito.filter((_, i) => i !== index);
    const nuevoInventario = { ...inventario };
    let stockRestaurado = false;

    Object.keys(nuevoInventario).forEach((cat) => {
      if (!categoriaTieneStock(cat)) return;

      nuevoInventario[cat] = nuevoInventario[cat].map((item) => {
        if (item.nombre === producto.nombre) {
          stockRestaurado = true;
          return { ...item, stock: item.stock + 1 };
        }
        return item;
      });
    });

    if (stockRestaurado) {
      setInventarioGuardado(nuevoInventario);
    }

    setCarrito(nuevoCarrito);
  };

  const finalizarVenta = () => {
    if (carrito.length === 0) return;

    const nuevaVenta = {
      id: Date.now(),
      productos: carrito,
      total: carrito.reduce((acc, p) => acc + p.precio, 0),
      fecha: new Date().toISOString(),
    };

    setVentas((prev) => [...prev, nuevaVenta]);
    setCarrito([]);
  };

  const ultimasVentas = [...ventas].reverse().slice(0, 5);

  return (
    <div className="page">
      <PageHeader
        title="Punto de venta"
        description="Registra pedidos y finaliza ventas."
      />

      <CategoryButtons active={categoria} onSelect={setCategoria} />

      <div className="ventas-layout">
        <ProductGrid
          products={inventario[categoria]}
          showStock={categoriaTieneStock(categoria)}
          onAdd={agregarProducto}
        />

        <div className="ventas-sidebar">
          <Carrito
            items={carrito}
            onRemove={eliminarProducto}
            onCheckout={finalizarVenta}
          />

          <Card title="Ventas recientes" subtitle="Últimos 5 registros">
            {ultimasVentas.length === 0 ? (
              <p className="text-muted">Sin ventas registradas.</p>
            ) : (
              <ul className="recent-list">
                {ultimasVentas.map((venta) => (
                  <li key={venta.id} className="recent-list__item">
                    <span>{formatDateTime(venta.fecha)}</span>
                    <strong>{formatSoles(venta.total)}</strong>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
