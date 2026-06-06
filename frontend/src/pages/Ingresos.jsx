import { useState } from "react";
import PageHeader from "../components/layout/PageHeader";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Badge from "../components/ui/Badge";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { formatSoles } from "../utils/currency";
import { formatDateTime } from "../utils/date";

export default function Ingresos() {
  const [ventas] = useLocalStorage(STORAGE_KEYS.VENTAS, []);
  const [expandido, setExpandido] = useState(null);

  const ventasOrdenadas = [...ventas].reverse();

  return (
    <div className="page">
      <PageHeader
        title="Historial de ingresos"
        description="Ventas del turno actual. Al cerrar caja, pasan al historial."
      />

      {ventasOrdenadas.length === 0 ? (
        <Card>
          <EmptyState
            title="Sin ingresos registrados"
            description="Las ventas finalizadas aparecerán aquí automáticamente."
          />
        </Card>
      ) : (
        <div className="income-list">
          {ventasOrdenadas.map((venta) => {
            const abierto = expandido === venta.id;

            return (
              <Card key={venta.id}>
                <button
                  type="button"
                  className="income-item"
                  onClick={() => setExpandido(abierto ? null : venta.id)}
                >
                  <div>
                    <p className="income-item__date">
                      {formatDateTime(venta.fecha)}
                    </p>
                    <p className="income-item__meta">
                      {venta.productos.length} producto(s)
                    </p>
                  </div>
                  <div className="income-item__right">
                    <strong>{formatSoles(venta.total)}</strong>
                    <span>{abierto ? "▲" : "▼"}</span>
                  </div>
                </button>

                {abierto && (
                  <ul className="income-detail">
                    {venta.productos.map((producto, index) => (
                      <li key={`${producto.nombre}-${index}`}>
                        <span>{producto.nombre}</span>
                        <Badge>{formatSoles(producto.precio)}</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
