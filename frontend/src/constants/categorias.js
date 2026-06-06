export const CATEGORIAS = [
  { id: "hamburguesas", label: "Hamburguesas", icon: "HB" },
  { id: "salchipapas", label: "Salchipapas", icon: "SP" },
  { id: "alitas", label: "Alitas", icon: "AL" },
  { id: "broaster", label: "Broaster", icon: "BR" },
  { id: "bebidas", label: "Bebidas", icon: "BB" },
  { id: "adicionales", label: "Adicionales", icon: "AD" },
];

export const CATEGORIAS_CON_STOCK = ["bebidas", "adicionales"];

export function categoriaTieneStock(categoria) {
  return CATEGORIAS_CON_STOCK.includes(categoria);
}

export const CATEGORIAS_GASTOS = [
  { id: "insumos", label: "Insumos" },
  { id: "servicios", label: "Servicios" },
  { id: "personal", label: "Personal" },
  { id: "otros", label: "Otros" },
];
