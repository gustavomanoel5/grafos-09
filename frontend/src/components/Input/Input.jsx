import { forwardRef, useMemo } from "react";
import "./Input.css";

const Input = forwardRef(({
  label,
  name,
  type = "text",
  value = "",
  onChange,
  onBlur,
  onFocus,
  placeholder,
  required = false,
  disabled = false,
  autoFocus = false,
  error,
  helperText,
  showErrors = true,
  className = "",
  inputClassName = "",
  size = "medium", // small, medium, large
  variant = "outlined", // outlined, filled
  fullWidth = true,
  id,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedby,
  // Props específicas para inputs numéricos
  min,
  max,
  step,
  // Props específicas para texto
  maxLength,
  minLength,
  pattern,
  // Props para textarea
  rows,
  cols,
  resize = true,
  ...otherProps
}, ref) => {
  // Gerar ID único se não fornecido
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  // Calcular erro de validação
  const validationError = useMemo(() => {
    if (!showErrors) return "";
    if (required && (!value || value.toString().trim() === "")) {
      return "Este campo é obrigatório";
    }
    if (type === "email" && value && !/\S+@\S+\.\S+/.test(value)) {
      return "Email inválido";
    }
    if (minLength && value && value.length < minLength) {
      return `Mínimo ${minLength} caracteres`;
    }
    if (maxLength && value && value.length > maxLength) {
      return `Máximo ${maxLength} caracteres`;
    }
    if (min !== undefined && value && Number(value) < min) {
      return `Valor mínimo: ${min}`;
    }
    if (max !== undefined && value && Number(value) > max) {
      return `Valor máximo: ${max}`;
    }
    return "";
  }, [showErrors, required, value, type, minLength, maxLength, min, max]);

  const displayError = error || validationError;
  const hasError = Boolean(displayError);

  // Determinar se é textarea
  const isTextarea = type === "textarea" || rows !== undefined;

  // Classes CSS dinâmicas
  const containerClasses = `
    input-container 
    ${size} 
    ${variant} 
    ${hasError ? 'error' : ''} 
    ${disabled ? 'disabled' : ''} 
    ${fullWidth ? 'full-width' : ''} 
    ${className}
  `.trim();

  const inputClasses = `
    input-field
    ${hasError ? 'input-error' : ''}
    ${inputClassName}
  `.trim();

  // Props comuns para input/textarea
  const commonProps = {
    id: inputId,
    name,
    value,
    onChange,
    onBlur,
    onFocus,
    placeholder,
    required,
    disabled,
    autoFocus,
    className: inputClasses,
    "aria-label": ariaLabel || label,
    "aria-describedby": ariaDescribedby || (displayError ? `${inputId}-error` : undefined),
    "aria-invalid": hasError,
    ref,
    ...otherProps
  };

  return (
    <div className={containerClasses}>
      {label && (
        <label 
          htmlFor={inputId}
          className={`input-label ${required ? 'required' : ''}`}
        >
          {label}
        </label>
      )}
      
      <div className="input-wrapper">
        {isTextarea ? (
          <textarea
            {...commonProps}
            rows={rows}
            cols={cols}
            style={{ resize: resize ? 'vertical' : 'none' }}
            maxLength={maxLength}
            minLength={minLength}
          />
        ) : (
          <input
            {...commonProps}
            type={type}
            min={min}
            max={max}
            step={step}
            maxLength={maxLength}
            minLength={minLength}
            pattern={pattern}
          />
        )}
      </div>

      {helperText && !displayError && (
        <span className="input-helper-text">{helperText}</span>
      )}

      {displayError && (
        <span 
          className="input-error-message" 
          id={`${inputId}-error`}
          role="alert"
        >
          {displayError}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
