import React, { useRef, useEffect } from "react";
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";

const MenuSearch = ({ 
  searchTerm, 
  setSearchTerm, 
  isSearchFocused, 
  setIsSearchFocused 
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchFocused]);

  return (
    <div className="menu-search">
      <div className="search-wrapper">
        <IoSearchOutline className="search-icon" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar menu... (Ctrl + /)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          className="search-input"
        />
        {searchTerm && (
          <button
            className="search-clear"
            onClick={() => setSearchTerm("")}
            aria-label="Limpar busca"
          >
            <IoCloseOutline />
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuSearch;