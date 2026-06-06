import { useState } from "react";
import PageHeader from "../components/layout/PageHeader";
import Card from "../components/ui/Card";
import StatCard from "../components/ui/StatCard";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import { useCierreCaja } from "../hooks/useCierreCaja";
import { formatSoles } from "../utils/currency";
import { formatDate, formatDateTime } from "../utils/date";
import { generarPdfCierre, generarPdfTurnoActual } from "../utils/generarPdfCierre";

export default function CierreCaja() {
  const {
    ventas,
    gastos,
    cierres,
    resumenAbierto,
    cajaAbierta,
    cerrarCaja,
    eliminarCierre,
  } = useCierreCaja();

  const [confirmar, setConfirmar] = useState(false);
  const [eliminarId, setEliminarId] = useState(null);
  const [expandido, setExpandido] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(""), 5000);
  };

  const ejecutarCierre = () => {
    const registro = cerrarCaja();
    setConfirmar(false);
    generarPdfCierre(registro);
    mostrarMensaje(
      "Caja cerrada correctamente. PDF descargado. El nuevo dia comienza desde cero."
    );
  };

  const confirmarEliminar = () => {
    if (eliminarId) {
      eliminarCierre(eliminarId);
      setEliminarId(null);
      setExpandido(null);
      mostrarMensaje("Cierre eliminado del historial.");
    }
  };

  return (
    <div className="page">
      <PageHeader
        title="Cierre de caja"
        description="Archiva las ventas y gastos del turno abierto para iniciar un nuevo dia."
        actions={
          <Badge variant={cajaAbierta ? "success" : "default"}>
            {cajaAbierta ? "Caja abierta" : "Caja cerrada"}
          </Badge>
        }
      />

      {mensaje && <div className="alert alert--success">{mensaje}</div>}

      <section className="stat-grid">
        <StatCard
          label="Ingresos del turno"
          value={formatSoles(resumenAbierto.ingresos)}
          variant="primary"
        />
        <StatCard
          label="Gastos del turno"
          value={formatSoles(resumenAbierto.gastos)}
          variant="warning"
        />
        <StatCard
          label="Beneficio del turno"
          value={formatSoles(resumenAbierto.beneficio)}
          variant={resumenAbierto.beneficio >= 0 ? "success" : "danger"}
        />
        <StatCard
          label="Ventas registradas"
          value={resumenAbierto.ventasCount}
          trend={`${resumenAbierto.productosVendidos} productos`}
        />
      </section>

      <div className="cierre-layout">
        <Card
          title="Resumen del turno actual"
          subtitle="Datos que se guardaran al cerrar caja"
        >
          <div className="cierre-resumen">
            <div className="cierre-resumen__row">
              <span>Ventas</span>
              <strong>{ventas.length}</strong>
            </div>
            <div className="cierre-resumen__row">
              <span>Gastos</span>
              <strong>{gastos.length}</strong>
            </div>
            <div className="cierre-resumen__row cierre-resumen__row--total">
              <span>Total a depositar</span>
              <strong>{formatSoles(resumenAbierto.beneficio)}</strong>
            </div>
          </div>

          <div className="cierre-actions">
            <Button
              variant="secondary"
              onClick={() =>
                generarPdfTurnoActual(ventas, gastos, resumenAbierto)
              }
            >
              Descargar PDF del turno
            </Button>

            {!confirmar ? (
              <Button className="cierre-btn" onClick={() => setConfirmar(true)}>
                Cerrar caja del dia
              </Button>
            ) : (
              <div className="cierre-confirm">
                <p>
                  Se guardara el resumen, se descargara el PDF y se reiniciaran
                  ventas y gastos para el siguiente dia. Deseas continuar?
                </p>
                <div className="cierre-confirm__actions">
                  <Button variant="secondary" onClick={() => setConfirmar(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={ejecutarCierre}>Confirmar cierre</Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card title="Historial de cierres" subtitle="Dias archivados anteriormente">
          {cierres.length === 0 ? (
            <EmptyState
              title="Sin cierres registrados"
              description="Cuando cierres caja, el historial aparecera aqui."
            />
          ) : (
            <ul className="cierre-historial">
              {cierres.map((cierre) => {
                const abierto = expandido === cierre.id;

                return (
                  <li key={cierre.id} className="cierre-historial__item">
                    <button
                      type="button"
                      className="cierre-historial__header"
                      onClick={() => setExpandido(abierto ? null : cierre.id)}
                    >
                      <div>
                        <p className="cierre-historial__fecha">
                          {formatDate(cierre.fecha)}
                        </p>
                        <p className="cierre-historial__meta">
                          Cerrado: {formatDateTime(cierre.cerradoEn)} ·{" "}
                          {cierre.resumen.ventasCount} ventas
                        </p>
                      </div>
                      <div className="cierre-historial__totales">
                        <strong>{formatSoles(cierre.resumen.beneficio)}</strong>
                        <span>{abierto ? "▲" : "▼"}</span>
                      </div>
                    </button>

                    {abierto && (
                      <div className="cierre-historial__detalle">
                        <div className="cierre-resumen__row">
                          <span>Ingresos</span>
                          <strong>{formatSoles(cierre.resumen.ingresos)}</strong>
                        </div>
                        <div className="cierre-resumen__row">
                          <span>Gastos</span>
                          <strong>{formatSoles(cierre.resumen.gastos)}</strong>
                        </div>
                        <div className="cierre-resumen__row">
                          <span>Productos vendidos</span>
                          <strong>{cierre.resumen.productosVendidos}</strong>
                        </div>

                        <div className="cierre-historial__botones">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => generarPdfCierre(cierre)}
                          >
                            Descargar PDF
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setEliminarId(cierre.id)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      {eliminarId && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Eliminar cierre de caja</h3>
            <p>
              Esta accion borrara el registro del historial. Los datos del PDF
              ya descargado no se veran afectados. Deseas continuar?
            </p>
            <div className="cierre-confirm__actions">
              <Button variant="secondary" onClick={() => setEliminarId(null)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={confirmarEliminar}>
                Eliminar cierre
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
