import React from "react";
import PropTypes from "prop-types";
import "./Checkbox.css";

const CheckBox = ({ 
  label, 
  checked = false, 
  onChange, 
  disabled = false, 
  id,
  name,
  value,
  ariaLabel,
  className = ""
}) => {
  const handleChange = (event) => {
    if (onChange && !disabled) {
      onChange(event);
    }
  };

  return (
    <label 
      className={`checkbox-container ${disabled ? 'disabled' : ''} ${className}`}
      htmlFor={id}
    >
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        value={value}
        className="checkbox-input"
        aria-label={ariaLabel || label}
      />
      {label && (
        <span className="checkbox-label">
          {label}
        </span>
      )}
    </label>
  );
};

CheckBox.propTypes = {
  label: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  ariaLabel: PropTypes.string,
  className: PropTypes.string
};

export default CheckBox;
