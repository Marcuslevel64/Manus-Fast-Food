import { HashRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Ventas from "./pages/Ventas";
import Inventario from "./pages/Inventario";
import Ingresos from "./pages/Ingresos";
import Gastos from "./pages/Gastos";
import Reportes from "./pages/Reportes";
import CierreCaja from "./pages/CierreCaja";
import "./styles/app.css";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="ventas" element={<Ventas />} />
          <Route path="inventario" element={<Inventario />} />
          <Route path="ingresos" element={<Ingresos />} />
          <Route path="gastos" element={<Gastos />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="cierre-caja" element={<CierreCaja />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
