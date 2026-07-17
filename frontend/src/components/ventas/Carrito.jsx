import { useEffect, useMemo, useState } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import Ticket from "../ticket/ticket";
import { useImpresion } from "../../hooks/useImpresion";
import { formatSoles } from "../../utils/currency";
import { agruparProductos, crearPedido } from "../../utils/ticketData";

const AUTO_PRINT_KEY = "manus_auto_print";

function getAutoPrintPreference() {
  try {
    return localStorage.getItem(AUTO_PRINT_KEY) === "true";
  } catch {
    return false;
  }
}

export default function Carrito({ items, onRemove, onCheckout }) {
  const [autoImprimir, setAutoImprimir] = useState(getAutoPrintPreference);
  const {
    estado,
    mensaje,
    impresoraGuardada,
    soportaBluetooth,
    limpiarMensaje,
    imprimirBluetooth,
    imprimirNavegador,
  } = useImpresion();

  const [ticketActivo, setTicketActivo] = useState(null);
  const productosAgrupados = useMemo(() => agruparProductos(items), [items]);
  const total = items.reduce((acc, item) => acc + item.precio, 0);
  const pedido = useMemo(
    () => (items.length > 0 ? crearPedido(items) : ticketActivo),
    [items, ticketActivo]
  );

  useEffect(() => {
    if (estado !== "success" && estado !== "error") return undefined;

    const timer = setTimeout(limpiarMensaje, 4000);
    return () => clearTimeout(timer);
  }, [estado, limpiarMensaje]);

  const handleAutoPrintChange = (event) => {
    const checked = event.target.checked;
    setAutoImprimir(checked);

    try {
      localStorage.setItem(AUTO_PRINT_KEY, String(checked));
    } catch {
      // ignore storage errors
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;

    const pedidoFinal = crearPedido(items);
    setTicketActivo(pedidoFinal);
    onCheckout();

    if (!autoImprimir) return;

    if (soportaBluetooth) {
      await imprimirBluetooth(pedidoFinal);
      return;
    }

    requestAnimationFrame(() => imprimirNavegador());
  };

  const handleBluetoothPrint = async () => {
    await imprimirBluetooth(pedido);
  };

  return (
    <Card
      title="Carrito de venta"
      subtitle={`${items.length} producto${items.length === 1 ? "" : "s"} seleccionado${items.length === 1 ? "" : "s"}`}
      className="cart-card"
    >
      {items.length === 0 ? (
        <EmptyState
          title="Carrito vacio"
          description="Selecciona productos del menu para iniciar una venta."
        />
      ) : (
        <>
          <ul className="cart-list">
            {productosAgrupados.map((item) => {
              const indices = items
                .map((cartItem, index) =>
                  cartItem.nombre === item.nombre ? index : -1
                )
                .filter((index) => index >= 0);
              const ultimoIndice = indices[indices.length - 1];

              return (
                <li key={item.nombre} className="cart-list__item">
                  <div className="cart-list__info">
                    <div className="cart-list__title-row">
                      <span className="cart-list__qty">{item.cantidad}x</span>
                      <p className="cart-list__name">{item.nombre}</p>
                    </div>
                    <p className="cart-list__price">
                      {formatSoles(item.precio)} c/u ·{" "}
                      {formatSoles(item.precio * item.cantidad)}
                    </p>
                  </div>

                  <Button
                    variant="danger"
                    size="sm"
                    className="cart-list__remove"
                    onClick={() => onRemove(ultimoIndice)}
                    aria-label={`Quitar ${item.nombre}`}
                  >
                    Quitar
                  </Button>
                </li>
              );
            })}
          </ul>

          <div className="cart-summary">
            <div className="cart-summary__row">
              <span>Subtotal</span>
              <strong>{formatSoles(total)}</strong>
            </div>
            <div className="cart-summary__row cart-summary__row--total">
              <span>Total a cobrar</span>
              <strong>{formatSoles(total)}</strong>
            </div>
          </div>

          <label className="cart-option">
            <input
              type="checkbox"
              checked={autoImprimir}
              onChange={handleAutoPrintChange}
            />
            <span>Imprimir ticket al finalizar venta</span>
          </label>

          {mensaje && (
            <p
              className={`cart-alert cart-alert--${estado === "error" ? "error" : estado === "success" ? "success" : "info"}`}
              role="status"
            >
              {mensaje}
            </p>
          )}

          {soportaBluetooth && impresoraGuardada && (
            <p className="cart-printer-hint">
              Ultima impresora: <strong>{impresoraGuardada}</strong>
            </p>
          )}

          <div className="cart-actions">
            <Button
              className="cart-actions__primary"
              onClick={handleCheckout}
              disabled={items.length === 0 || estado === "printing"}
            >
              Finalizar venta
            </Button>

            <div className="cart-actions__secondary">
              {soportaBluetooth && (
                <Button
                  variant="secondary"
                  onClick={handleBluetoothPrint}
                  disabled={items.length === 0 || estado === "printing"}
                >
                  {estado === "printing" ? "Imprimiendo..." : "Bluetooth"}
                </Button>
              )}

              <Button
                variant="secondary"
                onClick={imprimirNavegador}
                disabled={items.length === 0 || estado === "printing"}
              >
                Imprimir
              </Button>
            </div>
          </div>

          {!soportaBluetooth && (
            <p className="cart-printer-hint">
              Para Bluetooth directo usa Chrome o Edge. Tambien puedes imprimir si
              la ticketera ya esta emparejada en Windows.
            </p>
          )}
        </>
      )}

      {pedido && (
        <div className="ticket-print-area" aria-hidden="true">
          <Ticket pedido={pedido} />
        </div>
      )}
    </Card>
  );
}
