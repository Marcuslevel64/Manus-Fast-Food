import { buildEscPosTicket, buildEscPosTest } from "./escpos";

const COMMON_SERVICES = [
  "0000ff00-0000-1000-8000-00805f9b34fb",
  "0000ff01-0000-1000-8000-00805f9b34fb",
  "0000ff02-0000-1000-8000-00805f9b34fb",
  "0000fff0-0000-1000-8000-00805f9b34fb",
  "0000fff1-0000-1000-8000-00805f9b34fb",
  "0000fff2-0000-1000-8000-00805f9b34fb",
  "49535343-fe7d-4ae5-8fa7-afabb767bf78",
  "000018f0-0000-1000-8000-00805f9b34fb",
  "6e400001-b5a3-f393-e0a9-e50e24dcca9e",
  "00001101-0000-1000-8000-00805f9b34fb",
  "0000fee7-0000-1000-8000-00805f9b34fb",
  "0000ae30-0000-1000-8000-00805f9b34fb",
  "0000ae01-0000-1000-8000-00805f9b34fb",
  "e7810a71-73ae-499d-8c15-faa9aef0c3f2",
];

const PREFERRED_WRITE_UUIDS = [
  "0000fff2-0000-1000-8000-00805f9b34fb",
  "0000ff02-0000-1000-8000-00805f9b34fb",
  "0000ff01-0000-1000-8000-00805f9b34fb",
  "49535343-8841-43f4-a8d4-ecbe34729bb3",
  "6e400002-b5a3-f393-e0a9-e50e24dcca9e",
  "0000ae01-0000-1000-8000-00805f9b34fb",
];

const STORAGE_KEY = "manus_bt_printer";
const CHUNK_SIZE = 20;
const CHUNK_DELAY_MS = 40;
const WRITE_RETRIES = 2;

let activeConnection = null;

let printLock = Promise.resolve();

function withPrintLock(task) {
  const run = printLock.then(task, task);
  printLock = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

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

function scoreCharacteristic(characteristic) {
  const uuid = characteristic.uuid.toLowerCase();
  const preferredIndex = PREFERRED_WRITE_UUIDS.findIndex(
    (value) => value.toLowerCase() === uuid
  );

  let score = preferredIndex >= 0 ? 100 - preferredIndex : 0;

  if (characteristic.properties.writeWithoutResponse) score += 20;
  if (characteristic.properties.write) score += 10;

  return score;
}

async function findWritableCharacteristics(server) {
  const characteristics = [];
  const discoveredServices = [];

  try {
    const services = await server.getPrimaryServices();

    for (const service of services) {
      discoveredServices.push(service.uuid);
      const serviceCharacteristics = await service.getCharacteristics();

      for (const characteristic of serviceCharacteristics) {
        if (
          characteristic.properties.writeWithoutResponse ||
          characteristic.properties.write
        ) {
          characteristics.push(characteristic);
        }
      }
    }
  } catch (error) {
    throw new Error(
      `No se pudieron leer los servicios de la impresora: ${error.message}`,
      { cause: error }
    );
  }

  characteristics.sort((a, b) => scoreCharacteristic(b) - scoreCharacteristic(a));

  return { characteristics, discoveredServices };
}

async function writeInChunks(characteristic, data) {
  console.log("🔍 Escribiendo en caracteristica:", characteristic.uuid, {
    write: characteristic.properties.write,
    writeWithoutResponse: characteristic.properties.writeWithoutResponse,
    dataLength: data.length,
  });

  for (let offset = 0; offset < data.length; offset += CHUNK_SIZE) {
    const chunk = data.slice(offset, offset + CHUNK_SIZE);
    let attempt = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        if (characteristic.properties.write) {
          await characteristic.writeValue(chunk);
        } else {
          await characteristic.writeValueWithoutResponse(chunk);
        }
        break;
      } catch (error) {
        attempt += 1;
        if (attempt > WRITE_RETRIES) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, CHUNK_DELAY_MS * 2));
      }
    }

    await new Promise((resolve) => setTimeout(resolve, CHUNK_DELAY_MS));
  }
}

async function writeWithFallback(characteristics, data) {
  let lastError = null;

  for (const characteristic of characteristics) {
    try {
      await writeInChunks(characteristic, data);
      return characteristic;
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(
    lastError?.message ||
      "La impresora recibio la conexion pero no acepto los datos de impresion."
  );
}

async function ensureGattConnected(device) {
  if (!device.gatt) {
    throw new Error(
      "Esta impresora usa Bluetooth clasico y no es compatible con impresion directa desde el navegador. Usa el boton Imprimir con la ticketera agregada en Windows."
    );
  }

  if (device.gatt.connected) {
    return device.gatt;
  }

  return device.gatt.connect();
}

export function getActiveConnection() {
  return activeConnection;
}

export function disconnectBluetoothPrinter() {
  if (activeConnection?.server?.connected) {
    activeConnection.server.disconnect();
  }

  activeConnection = null;
}

export async function reconnectSavedPrinter() {
  if (!isBluetoothSupported() || !navigator.bluetooth.getDevices) {
    return null;
  }

  const savedName = getSavedPrinterName();
  if (!savedName) return null;

  const devices = await navigator.bluetooth.getDevices();
  const device = devices.find((item) => item.name === savedName);

  if (!device) return null;

  const server = await ensureGattConnected(device);
  const { characteristics, discoveredServices } = await findWritableCharacteristics(
    server
  );

  if (characteristics.length === 0) {
    throw new Error(buildNoWritableCharMessage(discoveredServices));
  }

  activeConnection = {
    device,
    server,
    characteristics,
    characteristic: characteristics[0],
  };

  return activeConnection;
}

function buildNoWritableCharMessage(discoveredServices) {
  const servicesText =
    discoveredServices.length > 0
      ? `Servicios detectados: ${discoveredServices.join(", ")}.`
      : "No se detecto ningun servicio (probablemente el servicio real de la impresora no esta en la lista de optionalServices).";

  return `La impresora se conecto pero no se encontro un canal de escritura BLE. ${servicesText} Comparte estos UUID para agregarlos a la lista de servicios soportados, o usa el boton Imprimir.`;
}

export async function connectBluetoothPrinter() {
  if (!isBluetoothSupported()) {
    throw new Error("Tu navegador no soporta Bluetooth. Usa Chrome o Edge.");
  }

  if (!window.isSecureContext) {
    throw new Error(
      "Bluetooth solo funciona en HTTPS o localhost. Abre la app desde una conexion segura."
    );
  }

  let device;

  try {
    device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: COMMON_SERVICES,
    });
  } catch (error) {
    if (error?.name === "NotFoundError") {
      throw error;
    }

    throw new Error(
      "No se pudo seleccionar la impresora. Si ya esta emparejada en Windows, desemparejala e intenta de nuevo desde Chrome.",
      { cause: error }
    );
  }

  const server = await ensureGattConnected(device);
  const { characteristics, discoveredServices } = await findWritableCharacteristics(
    server
  );

  if (characteristics.length === 0) {
    server.disconnect();
    throw new Error(buildNoWritableCharMessage(discoveredServices));
  }

  savePrinterName(device.name || "Impresora Bluetooth");

  activeConnection = {
    device,
    server,
    characteristics,
    characteristic: characteristics[0],
  };

  device.addEventListener("gattserverdisconnected", () => {
    if (activeConnection?.device?.id === device.id) {
      activeConnection = null;
    }
  });

  return activeConnection;
}

async function resolveConnection(connection = null) {
  if (
    (connection?.characteristics?.length || connection?.characteristic) &&
    connection?.server?.connected
  ) {
    return connection;
  }

  if (activeConnection?.server?.connected) {
    return activeConnection;
  }

  try {
    const reconnected = await reconnectSavedPrinter();
    if (reconnected) return reconnected;
  } catch {
    // fall back to picker
  }

  return connectBluetoothPrinter();
}

async function printRawBluetoothInternal(data, connection) {
  const linked = await resolveConnection(connection);
  const characteristics =
    linked.characteristics ||
    (linked.characteristic ? [linked.characteristic] : []);

  if (characteristics.length === 0) {
    throw new Error("No hay impresora conectada.");
  }

  const usedCharacteristic = await writeWithFallback(characteristics, data);

  activeConnection = {
    ...linked,
    characteristic: usedCharacteristic,
    characteristics,
  };

  return linked.device?.name || getSavedPrinterName() || "Impresora Bluetooth";
}

export function printRawBluetooth(data, connection = null) {
  return withPrintLock(() => printRawBluetoothInternal(data, connection));
}

export async function printTestBluetooth(connection = null) {
  return printRawBluetooth(buildEscPosTest(), connection);
}

export async function printPedidoBluetooth(pedido, connection = null) {
  return printRawBluetooth(buildEscPosTicket(pedido), connection);
}

export function printPedidoNavegador() {
  window.print();
}

export function getBluetoothHelpMessage() {
  return [
    "Usa Chrome o Edge en PC o Android.",
    "Si la ticketera ya esta emparejada en Windows, desemparejala antes de usar Bluetooth.",
    "Muchas ticketeras baratas solo funcionan con el boton Imprimir (Bluetooth clasico).",
    "Agrega la impresora en Configuracion > Impresoras de Windows y usa Imprimir.",
  ];
}
