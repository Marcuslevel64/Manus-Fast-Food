import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../../constants/navigation";

export default function Sidebar({ isOpen = false, onNavigate }) {
  return (
    <aside className={`sidebar${isOpen ? " sidebar--open" : ""}`}>
      <div className="sidebar__top">
        <div className="sidebar__brand">
          <span className="sidebar__logo">MF</span>
          <div>
            <p className="sidebar__name">Manus Fast Food</p>
            <p className="sidebar__tagline">Sistema de gestión</p>
          </div>
        </div>

        <button
          type="button"
          className="sidebar__close"
          onClick={onNavigate}
          aria-label="Cerrar menú"
        >
          ✕
        </button>
      </div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            onClick={onNavigate}
            className={({ isActive }) =>
              `sidebar__link${isActive ? " sidebar__link--active" : ""}`
            }
          >
            <span className="sidebar__icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <footer className="sidebar__footer">
        <p>© {new Date().getFullYear()} Manus Fast Food</p>
      </footer>
    </aside>
  );
}
