import { useCallback, useState } from "react";
import {
  getSavedPrinterName,
  isBluetoothSupported,
  printPedidoBluetooth,
  printPedidoNavegador,
} from "../utils/bluetoothPrinter";

export function useImpresion() {
  const [estado, setEstado] = useState("idle");
  const [mensaje, setMensaje] = useState("");
  const [impresoraGuardada] = useState(getSavedPrinterName);

  const limpiarMensaje = useCallback(() => {
    setEstado("idle");
    setMensaje("");
  }, []);

  const imprimirBluetooth = useCallback(async (pedido) => {
    if (!isBluetoothSupported()) {
      setEstado("error");
      setMensaje(
        "Bluetooth no disponible. Abre la app en Chrome o Edge para imprimir por Bluetooth."
      );
      return false;
    }

    setEstado("printing");
    setMensaje("Conectando con la impresora...");

    try {
      const nombre = await printPedidoBluetooth(pedido);
      setEstado("success");
      setMensaje(`Ticket enviado a ${nombre}.`);
      return true;
    } catch (error) {
      if (error?.name === "NotFoundError") {
        setEstado("idle");
        setMensaje("");
        return false;
      }

      setEstado("error");
      setMensaje(
        error?.message ||
          "No se pudo imprimir por Bluetooth. Verifica que la impresora este encendida y emparejada."
      );
      return false;
    }
  }, []);

  const imprimirNavegador = useCallback(() => {
    printPedidoNavegador();
    setEstado("success");
    setMensaje("Abriendo vista de impresion del navegador.");
    return true;
  }, []);

  return {
    estado,
    mensaje,
    impresoraGuardada,
    soportaBluetooth: isBluetoothSupported(),
    limpiarMensaje,
    imprimirBluetooth,
    imprimirNavegador,
  };
}
