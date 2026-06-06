import { CATEGORIAS } from "../../constants/categorias";

export default function CategoryButtons({ active, onSelect }) {
  return (
    <div className="category-grid">
      {CATEGORIAS.map((cat) => (
        <button
          key={cat.id}
          type="button"
          className={`category-card${
            active === cat.id ? " category-card--active" : ""
          }`}
          onClick={() => onSelect(cat.id)}
        >
          <span className="category-card__icon">{cat.icon}</span>
          <span className="category-card__label">{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
