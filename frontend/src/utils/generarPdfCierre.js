import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatSoles } from "./currency";
import { formatDate, formatDateTime } from "./date";
import { getFechaHoy } from "./cierreCaja";

function agregarEncabezado(doc, titulo) {
  doc.setFillColor(27, 38, 59);
  doc.rect(0, 0, 210, 32, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text("Manus Fast Food", 14, 14);
  doc.setFontSize(11);
  doc.text(titulo, 14, 24);
  doc.setTextColor(30, 30, 30);
}

export function generarPdfCierre(cierre, opciones = {}) {
  const doc = new jsPDF();
  const esBorrador = opciones.borrador;

  agregarEncabezado(
    doc,
    esBorrador ? "Resumen de turno (borrador)" : "Cierre de caja"
  );

  autoTable(doc, {
    startY: 40,
    head: [["Concepto", "Detalle"]],
    body: [
      ["Fecha", formatDate(cierre.fecha || getFechaHoy())],
      ["Cerrado", formatDateTime(cierre.cerradoEn || new Date().toISOString())],
      ["Ventas registradas", String(cierre.resumen.ventasCount)],
      ["Productos vendidos", String(cierre.resumen.productosVendidos)],
      ["Ingresos", formatSoles(cierre.resumen.ingresos)],
      ["Gastos", formatSoles(cierre.resumen.gastos)],
      ["Beneficio neto", formatSoles(cierre.resumen.beneficio)],
    ],
    theme: "grid",
    headStyles: { fillColor: [232, 93, 4] },
    styles: { fontSize: 10 },
  });

  let posY = doc.lastAutoTable.finalY + 12;

  if (cierre.ventas?.length > 0) {
    doc.setFontSize(12);
    doc.text("Detalle de ventas", 14, posY);

    autoTable(doc, {
      startY: posY + 4,
      head: [["Fecha", "Productos", "Total"]],
      body: cierre.ventas.map((venta) => [
        formatDateTime(venta.fecha),
        String(venta.productos.length),
        formatSoles(venta.total),
      ]),
      theme: "striped",
      headStyles: { fillColor: [27, 38, 59] },
      styles: { fontSize: 9 },
    });

    posY = doc.lastAutoTable.finalY + 12;
  }

  if (cierre.gastos?.length > 0) {
    if (posY > 250) {
      doc.addPage();
      posY = 20;
    }

    doc.setFontSize(12);
    doc.text("Detalle de gastos", 14, posY);

    autoTable(doc, {
      startY: posY + 4,
      head: [["Fecha", "Descripcion", "Categoria", "Monto"]],
      body: cierre.gastos.map((gasto) => [
        formatDateTime(gasto.fecha),
        gasto.descripcion,
        gasto.categoria,
        formatSoles(gasto.monto),
      ]),
      theme: "striped",
      headStyles: { fillColor: [27, 38, 59] },
      styles: { fontSize: 9 },
    });
  }

  const nombreArchivo = esBorrador
    ? `manus-turno-${getFechaHoy()}.pdf`
    : `manus-cierre-${cierre.fecha}.pdf`;

  doc.save(nombreArchivo);
}

export function generarPdfTurnoActual(ventas, gastos, resumen) {
  generarPdfCierre(
    {
      fecha: getFechaHoy(),
      cerradoEn: new Date().toISOString(),
      resumen,
      ventas,
      gastos,
    },
    { borrador: true }
  );
}
