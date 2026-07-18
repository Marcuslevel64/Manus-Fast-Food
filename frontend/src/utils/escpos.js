const ESC = 0x1b;
const GS = 0x1d;

function cmd(...bytes) {
  return Uint8Array.from(bytes);
}

function text(str) {
  const normalized = str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "?");

  return new TextEncoder().encode(normalized);
}

function line(str = "") {
  const bytes = text(str);
  const result = new Uint8Array(bytes.length + 1);
  result.set(bytes);
  result[bytes.length] = 0x0a;
  return result;
}

function concat(...parts) {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const result = new Uint8Array(total);
  let offset = 0;

  for (const part of parts) {
    result.set(part, offset);
    offset += part.length;
  }

  return result;
}

function padLine(left, right, width = 32) {
  const maxLeft = Math.max(1, width - right.length - 1);
  const trimmedLeft =
    left.length > maxLeft ? `${left.slice(0, maxLeft - 1)}.` : left;
  const spaces = Math.max(1, width - trimmedLeft.length - right.length);
  return `${trimmedLeft}${" ".repeat(spaces)}${right}`;
}

export function buildEscPosTest() {
  return concat(
    cmd(ESC, 0x40),
    cmd(ESC, 0x61, 0x01),
    line("MANUS FAST FOOD"),
    line("Prueba de impresion"),
    line(""),
    line("Si ves esto, Bluetooth funciona."),
    line(""),
    line(""),
    cmd(GS, 0x56, 0x00)
  );
}

export function buildEscPosTicket(pedido) {
  const fecha = pedido.fecha instanceof Date ? pedido.fecha : new Date(pedido.fecha);
  const fechaTexto = fecha.toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const chunks = [
    cmd(ESC, 0x40),
    cmd(ESC, 0x61, 0x01),
    cmd(ESC, 0x45, 0x01),
    line("MANUS FAST FOOD"),
    cmd(ESC, 0x45, 0x00),
    line("Comida rapida"),
    line("--------------------------------"),
    cmd(ESC, 0x61, 0x00),
    line(`Fecha: ${fechaTexto}`),
    line(`Pedido: ${pedido.id}`),
    line("--------------------------------"),
  ];

  for (const item of pedido.productos) {
    const subtotal = item.precio * item.cantidad;
    chunks.push(
      line(padLine(`${item.cantidad}x ${item.nombre}`, formatMoney(subtotal)))
    );
  }

  chunks.push(
    line("--------------------------------"),
    cmd(ESC, 0x45, 0x01),
    line(padLine("TOTAL", formatMoney(pedido.total))),
    cmd(ESC, 0x45, 0x00),
    line("--------------------------------"),
    cmd(ESC, 0x61, 0x01),
    line("Gracias por su compra!"),
    line(""),
    line(""),
    cmd(GS, 0x56, 0x00)
  );

  return concat(...chunks);
}

function formatMoney(amount) {
  return `S/. ${Number(amount).toFixed(2)}`;
}
