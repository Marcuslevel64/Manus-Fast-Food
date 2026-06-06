export default function Select({
  label,
  id,
  options,
  className = "",
  ...props
}) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`field ${className}`.trim()}>
      {label && (
        <label className="field__label" htmlFor={selectId}>
          {label}
        </label>
      )}
      <select id={selectId} className="field__select" {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
