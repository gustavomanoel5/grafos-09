import "./Button.css";

const Button = ({ 
  children, 
  onClick, 
  type = "button", 
  variant = "primary", 
  size = "medium",
  disabled = false,
  fullWidth = false,
  startIcon,
  endIcon,
  loading = false,
  className = "" 
}) => {
  // Mapeamento de classes antigas para nova estrutura (compatibilidade)
  let mappedVariant = variant;
  if (className.includes('primary')) mappedVariant = 'primary';
  if (className.includes('secondary')) mappedVariant = 'secondary';
  if (className.includes('success')) mappedVariant = 'success';
  if (className.includes('danger')) mappedVariant = 'danger';
  if (className.includes('edit-btn')) mappedVariant = 'warning';
  if (className.includes('btn-primary')) mappedVariant = 'primary';
  if (className.includes('btn-secondary')) mappedVariant = 'secondary';

  const baseClasses = [
    "btn",
    `btn--${mappedVariant}`,
    `btn--${size}`,
    disabled && "btn--disabled",
    fullWidth && "btn--full-width",
    loading && "btn--loading",
    className
  ].filter(Boolean).join(" ");

  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={baseClasses}
      disabled={disabled || loading}
    >
      {loading && <span className="btn__spinner" />}
      {startIcon && !loading && <span className="btn__icon btn__icon--start">{startIcon}</span>}
      <span className="btn__content">{children}</span>
      {endIcon && !loading && <span className="btn__icon btn__icon--end">{endIcon}</span>}
    </button>
  );
};

export default Button;

