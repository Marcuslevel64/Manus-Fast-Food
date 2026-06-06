export default function StatCard({ label, value, trend, variant = "default" }) {
  return (
    <article className={`stat-card stat-card--${variant}`}>
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value}</p>
      {trend && <p className="stat-card__trend">{trend}</p>}
    </article>
  );
}
