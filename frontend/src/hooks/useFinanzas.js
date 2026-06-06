import { useMemo } from "react";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { useLocalStorage } from "./useLocalStorage";
import { sumBy } from "../utils/currency";

export function useFinanzas() {
  const [ventas] = useLocalStorage(STORAGE_KEYS.VENTAS, []);
  const [gastos] = useLocalStorage(STORAGE_KEYS.GASTOS, []);
  const [cierres] = useLocalStorage(STORAGE_KEYS.CIERRES, []);

  const resumen = useMemo(() => {
    const ingresosTurno = sumBy(ventas, (v) => v.total);
    const gastosTurno = sumBy(gastos, (g) => Number(g.monto) || 0);
    const productosTurno = sumBy(ventas, (v) => v.productos.length);

    const ingresosHistorial = sumBy(cierres, (c) => c.resumen.ingresos);
    const gastosHistorial = sumBy(cierres, (c) => c.resumen.gastos);
    const ventasHistorial = sumBy(cierres, (c) => c.resumen.ventasCount);
    const productosHistorial = sumBy(
      cierres,
      (c) => c.resumen.productosVendidos
    );

    const totalIngresos = ingresosTurno + ingresosHistorial;
    const totalGastos = gastosTurno + gastosHistorial;

    return {
      ventas,
      gastos,
      cierres,
      totalIngresos,
      totalGastos,
      beneficio: totalIngresos - totalGastos,
      totalVentas: ventas.length + ventasHistorial,
      totalProductos: productosTurno + productosHistorial,
      ingresosHoy: ingresosTurno,
      egresosHoy: gastosTurno,
      gananciaHoy: ingresosTurno - gastosTurno,
      ventasTurno: ventas.length,
      gastosTurno: gastos.length,
    };
  }, [ventas, gastos, cierres]);

  return resumen;
}
