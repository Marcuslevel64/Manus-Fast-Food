import { sumBy } from "./currency";

export function getFechaHoy() {
  return new Date().toISOString().slice(0, 10);
}

export function calcularResumenCierre(ventas, gastos) {
  const ingresos = sumBy(ventas, (v) => v.total);
  const totalGastos = sumBy(gastos, (g) => Number(g.monto) || 0);
  const productosVendidos = sumBy(ventas, (v) => v.productos.length);

  return {
    ingresos,
    gastos: totalGastos,
    beneficio: ingresos - totalGastos,
    ventasCount: ventas.length,
    gastosCount: gastos.length,
    productosVendidos,
  };
}

export function crearRegistroCierre(ventas, gastos) {
  return {
    id: Date.now(),
    fecha: getFechaHoy(),
    cerradoEn: new Date().toISOString(),
    resumen: calcularResumenCierre(ventas, gastos),
    ventas,
    gastos,
  };
}
