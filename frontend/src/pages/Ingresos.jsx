function Ingresos() {
  const ventas = JSON.parse(
    localStorage.getItem("ventas") || "[]"
  );

  return (
    <div>
      <h1>💰 Historial de Ventas</h1>

      {ventas.length === 0 ? (
        <div className="card">
          No existen ventas registradas.
        </div>
      ) : (
        ventas
          .slice()
          .reverse()
          .map((venta) => (
            <div
              key={venta.id}
              className="card"
            >
              <h3>{venta.fecha}</h3>

              <p>
                Total: S/ {venta.total}
              </p>

              <p>
                Productos:
                {venta.productos.length}
              </p>
            </div>
          ))
      )}
    </div>
  );
}

export default Ingresos;