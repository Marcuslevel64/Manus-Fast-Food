import { useState, useEffect } from "react";
import productos from "../data/productos";
import Carrito from "../components/Carrito";
import CategoryButtons from "../components/CategoryButtons";

function Ventas() {
  const [categoria, setCategoria] = useState("hamburguesas");
  const [carrito, setCarrito] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [inventario, setInventario] = useState(productos);

  useEffect(() => {
    const ventasGuardadas = localStorage.getItem("ventas");

    if (ventasGuardadas) {
      setVentas(JSON.parse(ventasGuardadas));
    }

    const inventarioGuardado = localStorage.getItem("inventario");

    if (inventarioGuardado) {
      setInventario(JSON.parse(inventarioGuardado));
    }
  }, []);

  const agregarProducto = (producto) => {
    if (producto.stock <= 0) {
      alert("Producto agotado");
      return;
    }

    const nuevoInventario = { ...inventario };

    nuevoInventario[categoria] = nuevoInventario[categoria].map((item) =>
      item.nombre === producto.nombre
        ? { ...item, stock: item.stock - 1 }
        : item
    );

    setInventario(nuevoInventario);

    localStorage.setItem(
      "inventario",
      JSON.stringify(nuevoInventario)
    );

    setCarrito([...carrito, producto]);
  };

  const eliminarProducto = (index) => {
    const productoEliminado = carrito[index];

    const nuevoCarrito = [...carrito];
    nuevoCarrito.splice(index, 1);

    setCarrito(nuevoCarrito);

    const nuevoInventario = { ...inventario };

    Object.keys(nuevoInventario).forEach((categoriaActual) => {
      nuevoInventario[categoriaActual] =
        nuevoInventario[categoriaActual].map((item) =>
          item.nombre === productoEliminado.nombre
            ? { ...item, stock: item.stock + 1 }
            : item
        );
    });

    setInventario(nuevoInventario);

    localStorage.setItem(
      "inventario",
      JSON.stringify(nuevoInventario)
    );
  };

  const finalizarVenta = () => {
    if (carrito.length === 0) {
      alert("No hay productos en el carrito");
      return;
    }

    const nuevaVenta = {
      id: Date.now(),
      productos: carrito,
      total: carrito.reduce(
        (acc, producto) => acc + producto.precio,
        0
      ),
      fecha: new Date().toLocaleString(),
    };

    const nuevasVentas = [...ventas, nuevaVenta];

    setVentas(nuevasVentas);

    localStorage.setItem(
      "ventas",
      JSON.stringify(nuevasVentas)
    );

    setCarrito([]);

    alert("Venta registrada correctamente ✔");
  };

  return (
    <div>
      <h2 className="section-title">🛒 Ventas</h2>

      <CategoryButtons setCategoria={setCategoria} />

      <div className="ventas-layout">
        <div className="products">
          {inventario[categoria]?.map((item, index) => (
            <div className="product-card" key={index}>
              <h3>{item.nombre}</h3>

              <p>S/ {item.precio}</p>

              <p>
                <strong>Stock:</strong> {item.stock}
              </p>

              <button
                onClick={() => agregarProducto(item)}
              >
                Agregar
              </button>
            </div>
          ))}
        </div>

        <div>
          <Carrito
            carrito={carrito}
            eliminarProducto={eliminarProducto}
          />

          <button
            className="finish-btn"
            onClick={finalizarVenta}
          >
            Finalizar Venta
          </button>

          <div className="cart">
            <h2>📊 Últimas ventas</h2>

            {ventas.length === 0 ? (
              <p>No hay ventas registradas.</p>
            ) : (
              ventas
                .slice(-5)
                .reverse()
                .map((venta) => (
                  <div
                    key={venta.id}
                    className="cart-item"
                  >
                    <span>
                      {venta.fecha}
                    </span>

                    <strong>
                      S/ {venta.total}
                    </strong>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ventas;
