import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PageHeader from "../components/layout/PageHeader";
import StatCard from "../components/ui/StatCard";
import Card from "../components/ui/Card";
import { useFinanzas } from "../hooks/useFinanzas";
import { formatSoles } from "../utils/currency";
import { formatDate } from "../utils/date";

export default function Reportes() {
  const {
    ventas,
    gastos,
    cierres,
    totalIngresos,
    totalGastos,
    beneficio,
    totalProductos,
  } = useFinanzas();

  const todasLasVentas = useMemo(
    () => [...cierres.flatMap((c) => c.ventas), ...ventas],
    [cierres, ventas]
  );

  const todosLosGastos = useMemo(
    () => [...cierres.flatMap((c) => c.gastos), ...gastos],
    [cierres, gastos]
  );

  const ventasPorProducto = useMemo(() => {
    const conteo = {};

    todasLasVentas.forEach((venta) => {
      venta.productos.forEach((producto) => {
        conteo[producto.nombre] = (conteo[producto.nombre] || 0) + 1;
      });
    });

    return Object.entries(conteo)
      .map(([nombre, cantidad]) => ({ nombre, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 8);
  }, [todasLasVentas]);

  const gastosPorCategoria = useMemo(() => {
    const conteo = {};

    todosLosGastos.forEach((gasto) => {
      conteo[gasto.categoria] =
        (conteo[gasto.categoria] || 0) + (Number(gasto.monto) || 0);
    });

    return Object.entries(conteo).map(([categoria, monto]) => ({
      categoria,
      monto,
    }));
  }, [todosLosGastos]);

  const cierresPorDia = useMemo(
    () =>
      cierres.map((cierre) => ({
        fecha: formatDate(cierre.fecha),
        beneficio: cierre.resumen.beneficio,
      })),
    [cierres]
  );

  return (
    <div className="page">
      <PageHeader
        title="Reportes y análisis"
        description="Indicadores acumulados incluyendo cierres de caja anteriores."
      />

      <section className="stat-grid">
        <StatCard label="Ingresos totales" value={formatSoles(totalIngresos)} variant="primary" />
        <StatCard label="Gastos totales" value={formatSoles(totalGastos)} variant="warning" />
        <StatCard
          label="Beneficio neto"
          value={formatSoles(beneficio)}
          variant={beneficio >= 0 ? "success" : "danger"}
        />
        <StatCard label="Productos vendidos" value={totalProductos} />
      </section>

      <div className="reports-grid">
        <Card title="Productos más vendidos" subtitle="Top 8 por unidades">
          {ventasPorProducto.length === 0 ? (
            <p className="text-muted">No hay datos de ventas aún.</p>
          ) : (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={ventasPorProducto}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8eaed" />
                  <XAxis
                    dataKey="nombre"
                    tick={{ fontSize: 11 }}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="cantidad" fill="#e85d04" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card title="Gastos por categoría" subtitle="Distribución de egresos">
          {gastosPorCategoria.length === 0 ? (
            <p className="text-muted">No hay gastos registrados.</p>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Categoría</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {gastosPorCategoria.map((row) => (
                    <tr key={row.categoria}>
                      <td className="capitalize">{row.categoria}</td>
                      <td>{formatSoles(row.monto)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {cierresPorDia.length > 0 && (
        <Card title="Beneficio por cierre de caja" subtitle="Historial diario archivado">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={[...cierresPorDia].reverse()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8eaed" />
                <XAxis dataKey="fecha" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip formatter={(value) => formatSoles(value)} />
                <Bar dataKey="beneficio" fill="#2a9d8f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}
