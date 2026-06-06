export default function Input({ label, id, error, className = "", ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`field ${className}`.trim()}>
      {label && (
        <label className="field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input id={inputId} className="field__input" {...props} />
      {error && <span className="field__error">{error}</span>}
    </div>
  );
}
