import { useState, useEffect } from "react";

function Dashboard() {
  const [data, setData] = useState({
    eventos: 0,
    ingresos: 0,
    gastos: 0,
    beneficio: 0
  });

  useEffect(() => {
    // 1. Obtener datos del almacenamiento
    const ventas = JSON.parse(localStorage.getItem("ventas") || "[]");
    const gastos = JSON.parse(localStorage.getItem("gastos") || "[]");

    // 2. Calcular totales
    const numEventos = ventas.length;
    const totalIngresos = ventas.reduce((acc, v) => acc + v.total, 0);
    const totalGastos = gastos.reduce((acc, g) => acc + (Number(g.monto) || 0), 0);
    const totalBeneficio = totalIngresos - totalGastos;

    // 3. Actualizar estado
    setData({
      eventos: numEventos,
      ingresos: totalIngresos,
      gastos: totalGastos,
      beneficio: totalBeneficio
    });
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h2 style={{ marginBottom: "30px", color: "#333" }}>Resumen Ejecutivo</h2>
      
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <Card title="Número de eventos realizados" value={data.eventos} color="#333" />
        <Card title="Ingresos totales" value={`S/ ${data.ingresos.toFixed(3)}`} color="#003366" />
        <Card title="Gastos totales" value={`S/ ${data.gastos.toFixed(3)}`} color="red" />
        <Card title="Margen de beneficio" value={`S/ ${data.beneficio.toFixed(3)}`} color="green" />
      </div>
    </div>
  );
}

// Componente para las tarjetas
function Card({ title, value, color }) {
  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "20px",
      width: "250px",
      backgroundColor: "#fff",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }}>
      <p style={{ margin: "0 0 10px 0", color: "#555", fontSize: "14px" }}>{title}</p>
      <h3 style={{ margin: 0, fontSize: "28px", color: color }}>{value}</h3>
    </div>
  );
}

export default Dashboard;