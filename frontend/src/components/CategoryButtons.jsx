function CategoryButtons({ setCategoria }) {
  return (
    <div className="categories">
      <div
        className="category-card"
        onClick={() => setCategoria("hamburguesas")}
      >
        🍔
        <h3>Hamburguesas</h3>
      </div>

      <div
        className="category-card"
        onClick={() => setCategoria("salchipapas")}
      >
        🌭
        <h3>Salchipapas</h3>
      </div>

      <div
        className="category-card"
        onClick={() => setCategoria("alitas")}
      >
        🍗
        <h3>Alitas</h3>
      </div>

      <div
        className="category-card"
        onClick={() => setCategoria("broaster")}
      >
        🍖
        <h3>Broaster</h3>
      </div>

      <div
        className="category-card"
        onClick={() => setCategoria("bebidas")}
      >
        🥤
        <h3>Bebidas</h3>
      </div>

      <div
        className="category-card"
        onClick={() => setCategoria("adicionales")}
      >
        ➕
        <h3>Adicionales</h3>
      </div>
    </div>
  );
}

export default CategoryButtons;
