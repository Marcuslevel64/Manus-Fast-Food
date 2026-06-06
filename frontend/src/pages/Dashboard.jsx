import { Link } from "react-router-dom";
import PageHeader from "../components/layout/PageHeader";
import StatCard from "../components/ui/StatCard";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { useFinanzas } from "../hooks/useFinanzas";
import { formatSoles } from "../utils/currency";
import { formatDateTime } from "../utils/date";

export default function Dashboard() {
  const {
    ventas,
    totalIngresos,
    totalGastos,
    beneficio,
    totalVentas,
    totalProductos,
    ingresosHoy,
    egresosHoy,
    gananciaHoy,
    ventasTurno,
  } = useFinanzas();

  const ultimasVentas = [...ventas].reverse().slice(0, 5);
  const cajaAbierta = ventasTurno > 0 || ingresosHoy > 0;

  return (
    <div className="page">
      <PageHeader
        title="Dashboard"
        description="Resumen del turno actual y totales acumulados del negocio."
        actions={
          <Badge variant={cajaAbierta ? "success" : "default"}>
            {cajaAbierta ? "Turno abierto" : "Sin movimientos"}
          </Badge>
        }
      />

      <section className="stat-grid">
        <StatCard
          label="Ingresos del turno"
          value={formatSoles(ingresosHoy)}
          trend={`Acumulado: ${formatSoles(totalIngresos)}`}
          variant="primary"
        />
        <StatCard
          label="Gastos del turno"
          value={formatSoles(egresosHoy)}
          trend={`Acumulado: ${formatSoles(totalGastos)}`}
          variant="warning"
        />
        <StatCard
          label="Beneficio del turno"
          value={formatSoles(gananciaHoy)}
          trend={`Acumulado: ${formatSoles(beneficio)}`}
          variant={gananciaHoy >= 0 ? "success" : "danger"}
        />
        <StatCard
          label="Ventas del turno"
          value={ventasTurno}
          trend={`${totalVentas} totales · ${totalProductos} productos`}
        />
      </section>

      <Card
        title="Cierre de caja"
        subtitle="Al final del día, guarda los datos y reinicia para el siguiente turno."
      >
        <p className="text-muted cierre-dashboard__text">
          Cuando termines de vender, ve a Cierre de caja para archivar el día y
          empezar desde cero al día siguiente.
        </p>
        <Link to="/cierre-caja">
          <Button>Ir a cierre de caja</Button>
        </Link>
      </Card>

      <Card title="Últimas ventas del turno" subtitle="Actividad reciente">
        {ultimasVentas.length === 0 ? (
          <p className="text-muted">Aún no hay ventas en el turno actual.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Productos</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {ultimasVentas.map((venta) => (
                  <tr key={venta.id}>
                    <td>{formatDateTime(venta.fecha)}</td>
                    <td>{venta.productos.length}</td>
                    <td>{formatSoles(venta.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
