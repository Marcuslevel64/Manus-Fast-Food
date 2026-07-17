export function agruparProductos(items) {
  return Object.values(
    items.reduce((acc, item) => {
      if (!acc[item.nombre]) {
        acc[item.nombre] = {
          nombre: item.nombre,
          cantidad: 0,
          precio: item.precio,
        };
      }

      acc[item.nombre].cantidad += 1;
      return acc;
    }, {})
  );
}

export function crearPedido(items, id = null) {
  const productos = agruparProductos(items);
  const total = items.reduce((acc, item) => acc + item.precio, 0);

  return {
    id: id ?? `PED-${Date.now()}`,
    fecha: new Date(),
    productos,
    total,
  };
}

export function formatTicketMoney(amount) {
  return `S/. ${Number(amount).toFixed(2)}`;
}
