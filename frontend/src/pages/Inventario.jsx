import { useState, useEffect } from "react";

function Inventario() {
  const [abierto, setAbierto] = useState(null);

  const [insumos, setInsumos] = useState([
    { nombre: "Pan", stock: 100 },
    { nombre: "Carne", stock: 100 },
    { nombre: "Papas", stock: 200 },
    { nombre: "Queso", stock: 100 },
    { nombre: "Tocino", stock: 50 },
    {
      nombre: "Gaseosas",
      desplegable: true,
      items: [
        { nombre: "Coca Cola", stock: 30 },
        { nombre: "Inca Kola", stock: 30 },
        { nombre: "Seven Up", stock: 30 },
        { nombre: "Chicha 1L", stock: 20 },
        { nombre: "Piña 1L", stock: 20 }
      ]
    }
  ]);

  useEffect(() => {
    const data = localStorage.getItem("insumos");
    
    if (data) {
      const parsedData = JSON.parse(data);
      // Validamos si el localStorage ya tiene el formato nuevo revisando si Gaseosas es desplegable
      const formatoNuevo = parsedData.some(item => item.nombre === "Gaseosas" && item.desplegable);
      
      if (formatoNuevo) {
        setInsumos(parsedData); // Si el formato es correcto, usamos la memoria
      } else {
        // Si es el formato viejo, lo sobreescribimos automáticamente con el nuevo
        localStorage.setItem("insumos", JSON.stringify(insumos));
      }
    } else {
      localStorage.setItem("insumos", JSON.stringify(insumos));
    }
  }, []); // Solo se ejecuta al cargar el componente

  const guardarInsumos = (data) => {
    setInsumos(data);
    localStorage.setItem("insumos", JSON.stringify(data));
  };

  // INSUMOS NORMALES
  const cambiarStock = (nombre, tipo) => {
    const nuevo = insumos.map((item) => {
      if (item.nombre === nombre) {
        return {
          ...item,
          stock: tipo === "sumar" ? item.stock + 1 : item.stock - 1
        };
      }
      return item;
    });

    guardarInsumos(nuevo);
  };

  // GASEOSAS
  const cambiarGaseosa = (nombre, tipo) => {
    const nuevo = insumos.map((item) => {
      if (item.nombre === "Gaseosas") {
        return {
          ...item,
          items: item.items.map((g) =>
            g.nombre === nombre
              ? {
                  ...g,
                  stock: tipo === "sumar" ? g.stock + 1 : g.stock - 1
                }
              : g
          )
        };
      }
      return item;
    });

    guardarInsumos(nuevo);
  };

  return (
    <div>
      <h1>📦 Inventario</h1>

      <div className="card">
        <h2>Stock</h2>

        {insumos.map((item) => (
          <div key={item.nombre} className="cart-item">

            {/* HEADER */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                cursor: "pointer"
              }}
              onClick={() =>
                setAbierto(abierto === item.nombre ? null : item.nombre)
              }
            >
              <strong>{item.nombre}</strong>

              {item.desplegable && (
                <span>{abierto === item.nombre ? "▲" : "▼"}</span>
              )}
            </div>

            {/* STOCK NORMAL */}
            {!item.desplegable && (
              <div style={{ marginTop: "10px" }}>
                Stock: {item.stock}

                <button
                  style={{ marginLeft: "10px", marginRight: "5px" }}
                  onClick={() => cambiarStock(item.nombre, "sumar")}
                >
                  ➕
                </button>

                <button onClick={() => cambiarStock(item.nombre, "restar")}>
                  ➖
                </button>
              </div>
            )}

            {/* GASEOSAS */}
            {item.desplegable && abierto === item.nombre && (
              <div style={{ marginTop: 10 }}>
                {item.items.map((g) => (
                  <div
                    key={g.nombre}
                    className="cart-item"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "10px",
                      padding: "10px",
                      background: "rgba(0,0,0,0.2)", // Un fondo ligero para que resalte
                      borderRadius: "5px"
                    }}
                  >
                    <div>
                      {g.nombre}
                      <br />
                      Stock: {g.stock}
                    </div>

                    <div>
                      <button
                        style={{ marginRight: "5px" }}
                        onClick={() => cambiarGaseosa(g.nombre, "sumar")}
                      >
                        ➕
                      </button>

                      <button onClick={() => cambiarGaseosa(g.nombre, "restar")}>
                        ➖
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}

export default Inventario;
