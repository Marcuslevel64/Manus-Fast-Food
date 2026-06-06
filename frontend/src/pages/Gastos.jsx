import { useState } from "react";
import PageHeader from "../components/layout/PageHeader";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Badge from "../components/ui/Badge";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { CATEGORIAS_GASTOS } from "../constants/categorias";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { formatSoles } from "../utils/currency";
import { formatDateTime } from "../utils/date";

const FORM_INICIAL = {
  descripcion: "",
  monto: "",
  categoria: "insumos",
};

export default function Gastos() {
  const [gastos, setGastos] = useLocalStorage(STORAGE_KEYS.GASTOS, []);
  const [form, setForm] = useState(FORM_INICIAL);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const registrarGasto = (e) => {
    e.preventDefault();
    setError("");

    const monto = Number(form.monto);
    if (!form.descripcion.trim()) {
      setError("Ingresa una descripción.");
      return;
    }
    if (!monto || monto <= 0) {
      setError("Ingresa un monto válido.");
      return;
    }

    const nuevoGasto = {
      id: Date.now(),
      descripcion: form.descripcion.trim(),
      monto,
      categoria: form.categoria,
      fecha: new Date().toISOString(),
    };

    setGastos((prev) => [...prev, nuevoGasto]);
    setForm(FORM_INICIAL);
  };

  const eliminarGasto = (id) => {
    setGastos((prev) => prev.filter((g) => g.id !== id));
  };

  const gastosOrdenados = [...gastos].reverse();
  const total = gastos.reduce((acc, g) => acc + (Number(g.monto) || 0), 0);

  return (
    <div className="page">
      <PageHeader
        title="Control de gastos"
        description="Gastos del turno actual. Al cerrar caja, se archivan y reinician."
      />

      <div className="gastos-layout">
        <Card title="Nuevo gasto" subtitle="Complete el formulario para registrar">
          <form className="form" onSubmit={registrarGasto}>
            <Input
              label="Descripción"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Ej: Compra de pan y carne"
            />
            <Input
              label="Monto (S/)"
              name="monto"
              type="number"
              min="0"
              step="0.01"
              value={form.monto}
              onChange={handleChange}
              placeholder="0.00"
            />
            <Select
              label="Categoría"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              options={CATEGORIAS_GASTOS.map((c) => ({
                value: c.id,
                label: c.label,
              }))}
            />
            {error && <p className="form__error">{error}</p>}
            <Button type="submit">Registrar gasto</Button>
          </form>
        </Card>

        <Card
          title="Gastos registrados"
          subtitle={`Total acumulado: ${formatSoles(total)}`}
        >
          {gastosOrdenados.length === 0 ? (
            <EmptyState
              title="Sin gastos"
              description="Los egresos que registres aparecerán en esta lista."
            />
          ) : (
            <ul className="expense-list">
              {gastosOrdenados.map((gasto) => (
                <li key={gasto.id} className="expense-list__item">
                  <div>
                    <p className="expense-list__desc">{gasto.descripcion}</p>
                    <p className="expense-list__meta">
                      {formatDateTime(gasto.fecha)} ·{" "}
                      <Badge variant="default">
                        {CATEGORIAS_GASTOS.find((c) => c.id === gasto.categoria)
                          ?.label || gasto.categoria}
                      </Badge>
                    </p>
                  </div>
                  <div className="expense-list__actions">
                    <strong>{formatSoles(gasto.monto)}</strong>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => eliminarGasto(gasto.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
