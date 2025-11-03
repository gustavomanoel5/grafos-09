import { useState, useEffect, useRef } from "react";
import "./Dropdown.css";

const Dropdown = ({
  options = [],
  onSelect,
  placeholder = "Selecione uma opção",
  selectedOption,
  label,
  error,
  disabled = false,
  required = false,
  searchable = true,
  maxHeight = 300,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    if (selectedOption !== null && selectedOption !== undefined && selectedOption !== "") {
      const matchedOption = options.find(
        (opt) => opt.value === selectedOption || opt.value === selectedOption?.value
      );
      setSelected(matchedOption || null);
    } else {
      setSelected(null);
    }
  }, [selectedOption, options]);

  const filteredOptions = searchable 
    ? options.filter((option) =>
        option.label?.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  const handleSelect = (option) => {
    setSelected(option);
    onSelect?.(option.value);
    setIsOpen(false);
    setSearch("");
  };

  const handleToggle = () => {
    if (disabled) return;
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    // Focar no campo de busca quando abrir (se tiver muitas opções)
    if (newIsOpen && searchable && options.length > 10) {
      setTimeout(() => searchRef.current?.focus(), 150);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className={`dropdown ${className}`}>
      {label && (
        <label className={`dropdown__label ${required ? 'dropdown__label--required' : ''}`}>
          {label}
        </label>
      )}
      
      <div 
        className={`dropdown__container ${error ? 'dropdown__container--error' : ''}`} 
        ref={dropdownRef}
      >
        <button
          type="button"
          className={`dropdown__trigger ${isOpen ? 'dropdown__trigger--open' : ''} ${selected ? 'dropdown__trigger--selected' : ''} ${disabled ? 'dropdown__trigger--disabled' : ''}`}
          onClick={handleToggle}
          disabled={disabled}
        >
          <span className="dropdown__value">
            {selected ? selected.label : placeholder}
          </span>
          <span className={`dropdown__arrow ${isOpen ? 'dropdown__arrow--rotated' : ''}`}>
            ▼
          </span>
        </button>

        {isOpen && (
          <div className="dropdown__menu">
            {searchable && options.length > 0 && (
              <div className="dropdown__search">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder={`Pesquisar em ${options.length} opções...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="dropdown__search-input"
                  autoComplete="off"
                />
                {search && (
                  <div className="dropdown__search-info">
                    {filteredOptions.length} de {options.length} resultados
                  </div>
                )}
              </div>
            )}

            <div 
              className="dropdown__options"
              style={{ maxHeight }}
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`dropdown__option ${selected?.value === option.value ? 'dropdown__option--selected' : ''}`}
                    onClick={() => handleSelect(option)}
                  >
                    {option.label}
                  </div>
                ))
              ) : (
                <div className="dropdown__no-options">
                  {search ? (
                    <>
                      <strong>Nenhum resultado para "{search}"</strong>
                      <br />
                      <small>Tente uma busca diferente</small>
                    </>
                  ) : (
                    "Sem opções disponíveis"
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {error && <span className="dropdown__error">{error}</span>}
    </div>
  );
};

export default Dropdown;
