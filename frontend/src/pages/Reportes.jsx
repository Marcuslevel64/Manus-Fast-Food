function Reportes() {
  const ventas = JSON.parse(
    localStorage.getItem("ventas") || "[]"
  );

  const totalVentas = ventas.reduce(
    (acc, venta) => acc + venta.total,
    0
  );

  const totalProductos = ventas.reduce(
    (acc, venta) =>
      acc + venta.productos.length,
    0
  );

  return (
    <div>
      <h1>📈 Reportes</h1>

      <div className="cards">

        <div className="card">
          <h3>Ventas Totales</h3>
          <p>S/ {totalVentas}</p>
        </div>

        <div className="card">
          <h3>Productos Vendidos</h3>
          <p>{totalProductos}</p>
        </div>

      </div>
    </div>
  );
}

export default Reportes;