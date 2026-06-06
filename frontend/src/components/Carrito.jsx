function Carrito({ carrito, eliminarProducto }) {
  const total = carrito.reduce(
    (acumulado, producto) => acumulado + producto.precio,
    0
  );

  return (
    <div className="cart">
      <h2>🛒 Carrito</h2>

      {carrito.length === 0 ? (
        <p>No hay productos agregados.</p>
      ) : (
        <>
          {carrito.map((producto, index) => (
            <div className="cart-item" key={index}>
              <span>
                {producto.nombre} - S/ {producto.precio}
              </span>

              <button
                className="delete-btn"
                onClick={() => eliminarProducto(index)}
              >
                ❌
              </button>
            </div>
          ))}

          <h3>Total: S/ {total}</h3>
        </>
      )}
    </div>
  );
}

export default Carrito;