import { useState } from "react";
import PageHeader from "../components/layout/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { INSUMOS_INICIALES } from "../constants/insumos";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function Inventario() {
  const [abierto, setAbierto] = useState(null);
  const [insumos, setInsumos] = useLocalStorage(
    STORAGE_KEYS.INSUMOS,
    INSUMOS_INICIALES
  );

  const actualizarStock = (nombre, delta, esGaseosa = false) => {
    setInsumos((prev) =>
      prev.map((item) => {
        if (esGaseosa) {
          if (!item.desplegable) return item;
          return {
            ...item,
            items: item.items.map((g) =>
              g.nombre === nombre
                ? { ...g, stock: Math.max(0, g.stock + delta) }
                : g
            ),
          };
        }

        if (item.nombre !== nombre || item.desplegable) return item;
        return { ...item, stock: Math.max(0, item.stock + delta) };
      })
    );
  };

  return (
    <div className="page">
      <PageHeader
        title="Inventario de insumos"
        description="Control de materia prima y productos de reposición."
      />

      <Card title="Stock actual" subtitle="Ajusta cantidades según entradas y salidas">
        <div className="inventory-list">
          {insumos.map((item) => (
            <div key={item.nombre} className="inventory-item">
              {item.desplegable ? (
                <button
                  type="button"
                  className="inventory-item__header inventory-item__header--clickable"
                  onClick={() =>
                    setAbierto(abierto === item.nombre ? null : item.nombre)
                  }
                >
                  <span className="inventory-item__name">{item.nombre}</span>
                  <span className="inventory-item__toggle">
                    {abierto === item.nombre ? "▲" : "▼"}
                  </span>
                </button>
              ) : (
                <div className="inventory-item__header">
                  <span className="inventory-item__name">{item.nombre}</span>
                  <Badge variant={item.stock < 20 ? "warning" : "default"}>
                    {item.stock} uds.
                  </Badge>
                </div>
              )}

              {!item.desplegable && (
                <div className="inventory-item__actions">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => actualizarStock(item.nombre, -1)}
                  >
                    −
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => actualizarStock(item.nombre, 1)}
                  >
                    +
                  </Button>
                </div>
              )}

              {item.desplegable && abierto === item.nombre && (
                <div className="inventory-sublist">
                  {item.items.map((gaseosa) => (
                    <div key={gaseosa.nombre} className="inventory-subitem">
                      <div>
                        <p className="inventory-subitem__name">
                          {gaseosa.nombre}
                        </p>
                        <Badge
                          variant={gaseosa.stock < 10 ? "warning" : "default"}
                        >
                          {gaseosa.stock} uds.
                        </Badge>
                      </div>
                      <div className="inventory-item__actions">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            actualizarStock(gaseosa.nombre, -1, true)
                          }
                        >
                          −
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() =>
                            actualizarStock(gaseosa.nombre, 1, true)
                          }
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
