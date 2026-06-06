import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { formatSoles } from "../../utils/currency";

export default function ProductGrid({ products, showStock = false, onAdd }) {
  if (!products?.length) {
    return <p className="text-muted">No hay productos en esta categoría.</p>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => {
        const agotado = showStock && product.stock <= 0;

        return (
          <article key={product.nombre} className="product-card">
            <div className="product-card__header">
              <h3>{product.nombre}</h3>
              {showStock && (
                <Badge variant={agotado ? "danger" : "success"}>
                  {agotado ? "Agotado" : `${product.stock} uds.`}
                </Badge>
              )}
            </div>
            <p className="product-card__price">{formatSoles(product.precio)}</p>
            <Button
              variant="secondary"
              disabled={agotado}
              onClick={() => onAdd(product)}
            >
              Agregar
            </Button>
          </article>
        );
      })}
    </div>
  );
}
