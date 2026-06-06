import "./App.css";

function App() {

  const hamburguesas = [
    { nombre: "Clásica", precio: 12 },
    { nombre: "Royal", precio: 15 },
    { nombre: "A lo Pobre", precio: 18 },
    { nombre: "Bacon Cheese", precio: 18 },
    { nombre: "Manus Royal", precio: 20 },
    { nombre: "Manus XL", precio: 22 },
    { nombre: "Manus Crunch", precio: 15 }
  ];

  return (
    <div className="app">

      <aside className="sidebar">
        <h2>🍔 MANUS FAST FOOD</h2>

        <ul>
          <li>📊 Dashboard</li>
          <li>🛒 Ventas</li>
          <li>📦 Inventario</li>
          <li>💰 Ingresos</li>
          <li>💸 Gastos</li>
          <li>📈 Reportes</li>
        </ul>
      </aside>

      <main className="content">

        <h1>Dashboard</h1>

        <div className="cards">

          <div className="card">
            <h3>Ventas Hoy</h3>
            <p>S/ 0.00</p>
          </div>

          <div className="card">
            <h3>Gastos Hoy</h3>
            <p>S/ 0.00</p>
          </div>

          <div className="card">
            <h3>Ganancia</h3>
            <p>S/ 0.00</p>
          </div>

          <div className="card">
            <h3>Productos Vendidos</h3>
            <p>0</p>
          </div>

        </div>

        <h2 className="section-title">🍔 Hamburguesas</h2>

        <div className="products">

          {hamburguesas.map((item, index) => (
            <div className="product-card" key={index}>

              <h3>{item.nombre}</h3>

              <p>S/ {item.precio}</p>

              <button>
                Agregar
              </button>

            </div>
          ))}

        </div>

      </main>

    </div>
  );
}

export default App;