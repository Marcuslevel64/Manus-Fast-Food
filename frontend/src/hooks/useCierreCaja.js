import { useMemo } from "react";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { useLocalStorage } from "./useLocalStorage";
import { crearRegistroCierre, calcularResumenCierre } from "../utils/cierreCaja";

export function useCierreCaja() {
  const [ventas, setVentas] = useLocalStorage(STORAGE_KEYS.VENTAS, []);
  const [gastos, setGastos] = useLocalStorage(STORAGE_KEYS.GASTOS, []);
  const [cierres, setCierres] = useLocalStorage(STORAGE_KEYS.CIERRES, []);

  const resumenAbierto = useMemo(
    () => calcularResumenCierre(ventas, gastos),
    [ventas, gastos]
  );

  const cajaAbierta = ventas.length > 0 || gastos.length > 0;

  const cerrarCaja = () => {
    const registro = crearRegistroCierre(ventas, gastos);

    setCierres((prev) => [registro, ...prev]);
    setVentas([]);
    setGastos([]);

    return registro;
  };

  const eliminarCierre = (id) => {
    setCierres((prev) => prev.filter((cierre) => cierre.id !== id));
  };

  return {
    ventas,
    gastos,
    cierres,
    resumenAbierto,
    cajaAbierta,
    cerrarCaja,
    eliminarCierre,
  };
}
