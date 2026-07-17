import "./ticket.css";
import { formatTicketMoney } from "../../utils/ticketData";
import { formatDateTime } from "../../utils/date";

export default function Ticket({ pedido }) {
  const fecha =
    pedido.fecha instanceof Date ? pedido.fecha : new Date(pedido.fecha);

  return (
    <article className="ticket" aria-label="Ticket de venta">
      <header className="ticket__header">
        <p className="ticket__brand">MANUS FAST FOOD</p>
        <p className="ticket__tagline">Comida rapida</p>
      </header>

      <div className="ticket__meta">
        <p>Fecha: {formatDateTime(fecha)}</p>
        <p>Pedido: {pedido.id}</p>
      </div>

      <div className="ticket__divider" role="presentation" />

      <ul className="ticket__items">
        {pedido.productos.map((item) => (
          <li key={item.nombre} className="ticket__row">
            <span className="ticket__item-name">
              {item.cantidad}x {item.nombre}
            </span>
            <span className="ticket__item-price">
              {formatTicketMoney(item.precio * item.cantidad)}
            </span>
          </li>
        ))}
      </ul>

      <div className="ticket__divider" role="presentation" />

      <div className="ticket__row ticket__total">
        <span>TOTAL</span>
        <span>{formatTicketMoney(pedido.total)}</span>
      </div>

      <div className="ticket__divider" role="presentation" />

      <footer className="ticket__footer">
        <p>Gracias por su compra!</p>
      </footer>
    </article>
  );
}
