import Button from "../ui/Button";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { formatSoles } from "../../utils/currency";

export default function Carrito({ items, onRemove, onCheckout }) {
  const total = items.reduce((acc, item) => acc + item.precio, 0);

  return (
    <Card title="Carrito de venta" subtitle="Productos seleccionados">
      {items.length === 0 ? (
        <EmptyState
          title="Carrito vacío"
          description="Selecciona productos del menú para iniciar una venta."
        />
      ) : (
        <>
          <ul className="cart-list">
            {items.map((item, index) => (
              <li key={`${item.nombre}-${index}`} className="cart-list__item">
                <div>
                  <p className="cart-list__name">{item.nombre}</p>
                  <p className="cart-list__price">{formatSoles(item.precio)}</p>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onRemove(index)}
                >
                  Quitar
                </Button>
              </li>
            ))}
          </ul>

          <div className="cart-list__footer">
            <span>Total</span>
            <strong>{formatSoles(total)}</strong>
          </div>

          <Button className="cart-list__checkout" onClick={onCheckout}>
            Finalizar venta
          </Button>
        </>
      )}
    </Card>
  );
}
