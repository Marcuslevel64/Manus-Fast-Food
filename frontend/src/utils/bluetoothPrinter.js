import { buildEscPosTicket } from "./escpos";

const COMMON_SERVICES = [
  "0000ff00-0000-1000-8000-00805f9b34fb",
  "49535343-fe7d-4ae5-8fa7-afabb767bf78",
  "000018f0-0000-1000-8000-00805f9b34fb",
  "6e400001-b5a3-f393-e0a9-e50e24dcca9e",
];

const CHUNK_SIZE = 180;
const STORAGE_KEY = "manus_bt_printer";

export function isBluetoothSupported() {
  return typeof navigator !== "undefined" && "bluetooth" in navigator;
}

export function getSavedPrinterName() {
  try {
    return localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

function savePrinterName(name) {
  try {
    if (name) {
      localStorage.setItem(STORAGE_KEY, name);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

async function findWritableCharacteristic(server) {
  const services = await server.getPrimaryServices();

  for (const service of services) {
    const characteristics = await service.getCharacteristics();

    for (const characteristic of characteristics) {
      if (characteristic.properties.writeWithoutResponse) {
        return characteristic;
      }

      if (characteristic.properties.write) {
        return characteristic;
      }
    }
  }

  return null;
}

async function writeInChunks(characteristic, data) {
  for (let offset = 0; offset < data.length; offset += CHUNK_SIZE) {
    const chunk = data.slice(offset, offset + CHUNK_SIZE);

    if (characteristic.properties.writeWithoutResponse) {
      await characteristic.writeValueWithoutResponse(chunk);
    } else {
      await characteristic.writeValue(chunk);
    }

    await new Promise((resolve) => setTimeout(resolve, 30));
  }
}

export async function connectBluetoothPrinter() {
  if (!isBluetoothSupported()) {
    throw new Error("Tu navegador no soporta Bluetooth. Usa Chrome o Edge.");
  }

  const device = await navigator.bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: COMMON_SERVICES,
  });

  const server = await device.gatt.connect();
  const characteristic = await findWritableCharacteristic(server);

  if (!characteristic) {
    server.disconnect();
    throw new Error(
      "No se encontro una caracteristica de escritura compatible con esta impresora."
    );
  }

  savePrinterName(device.name || "Impresora Bluetooth");

  return { device, server, characteristic };
}

export async function printPedidoBluetooth(pedido, connection = null) {
  const data = buildEscPosTicket(pedido);
  let server = connection?.server;
  let characteristic = connection?.characteristic;
  let device = connection?.device;
  let shouldDisconnect = false;

  if (!characteristic) {
    const linked = await connectBluetoothPrinter();
    device = linked.device;
    server = linked.server;
    characteristic = linked.characteristic;
    shouldDisconnect = true;
  }

  try {
    await writeInChunks(characteristic, data);
    return device?.name || getSavedPrinterName() || "Impresora Bluetooth";
  } finally {
    if (shouldDisconnect && server?.connected) {
      server.disconnect();
    }
  }
}

export function printPedidoNavegador() {
  window.print();
}
