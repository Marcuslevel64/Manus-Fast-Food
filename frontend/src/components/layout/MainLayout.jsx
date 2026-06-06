import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { NAV_ITEMS } from "../../constants/navigation";

export default function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const paginaActual = NAV_ITEMS.find(
    (item) =>
      item.path === location.pathname ||
      (item.path !== "/" && location.pathname.startsWith(item.path))
  );

  const cerrarMenu = () => setMenuOpen(false);

  return (
    <div className="app-shell">
      <header className="mobile-header">
        <button
          type="button"
          className="mobile-header__menu"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menú"
        >
          ☰
        </button>
        <div className="mobile-header__info">
          <p className="mobile-header__brand">Manus Fast Food</p>
          <p className="mobile-header__page">
            {paginaActual?.label || "Sistema"}
          </p>
        </div>
      </header>

      {menuOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          onClick={cerrarMenu}
          aria-label="Cerrar menú"
        />
      )}

      <Sidebar isOpen={menuOpen} onNavigate={cerrarMenu} />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
