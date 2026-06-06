import "./App.css";
import { useState, useEffect } from "react";

import Ventas from "./pages/Ventas";
import Inventario from "./pages/Inventario";
import Ingresos from "./pages/Ingresos";
import Gastos from "./pages/Gastos";
import Reportes from "./pages/Reportes";

function App() {
  const [paginaActual, setPaginaActual] = useState("dashboard");

  const [totalVentas, setTotalVentas] = useState(0);
  const [productosVendidos, setProductosVendidos] = useState(0);

  // SOLO SE EJECUTA AL INICIO
  useEffect(() => {
    const ventas = JSON.parse(localStorage.getItem("ventas") || "[]");

    const total = ventas.reduce(
      (acc, venta) => acc + venta.total,
      0
    );

    const productos = ventas.reduce(
      (acc, venta) => acc + venta.productos.length,
      0
    );

    setTotalVentas(total);
    setProductosVendidos(productos);
  }, []);

  return (
    <div className="app">

      <aside className="sidebar">
        <h2>🍔 MANUS FAST FOOD</h2>

        <ul>
          <li onClick={() => setPaginaActual("dashboard")}>
            📊 Dashboard
          </li>

          <li onClick={() => setPaginaActual("ventas")}>
            🛒 Ventas
          </li>

          <li onClick={() => setPaginaActual("inventario")}>
            📦 Inventario
          </li>

          <li onClick={() => setPaginaActual("ingresos")}>
            💰 Ingresos
          </li>

          <li onClick={() => setPaginaActual("gastos")}>
            💸 Gastos
          </li>

          <li onClick={() => setPaginaActual("reportes")}>
            📈 Reportes
          </li>
        </ul>
      </aside>

      <main className="content">

        {paginaActual === "dashboard" && (
          <>
            <h1>📊 Dashboard</h1>

            <div className="cards">

              <div className="card">
                <h3>Ventas Totales</h3>
                <p>S/ {totalVentas}</p>
              </div>

              <div className="card">
                <h3>Gastos</h3>
                <p>S/ 0.00</p>
              </div>

              <div className="card">
                <h3>Ganancia</h3>
                <p>S/ {totalVentas}</p>
              </div>

              <div className="card">
                <h3>Productos Vendidos</h3>
                <p>{productosVendidos}</p>
              </div>

            </div>
          </>
        )}

        {paginaActual === "ventas" && <Ventas />}

        {paginaActual === "inventario" && <Inventario />}

        {paginaActual === "ingresos" && <Ingresos />}

        {paginaActual === "gastos" && <Gastos />}

        {paginaActual === "reportes" && <Reportes />}

      </main>

    </div>
  );
}

export default App;
