import React from 'react';
import { IoSunnyOutline, IoMoonOutline, IoPhonePortraitOutline } from 'react-icons/io5';
import useTheme from '../../hooks/useTheme';
import Button from '../Button/Button';
import './ThemeToggle.css';

/**
 * Componente para alternar entre temas (claro/escuro/auto)
 * Suporta:
 * - Modo claro
 * - Modo escuro  
 * - Modo automático (segue preferência do sistema)
 */
const ThemeToggle = ({ variant = 'icon', size = 'medium', className = '' }) => {
  const { theme, setTheme, isDark, isAuto } = useTheme();

  const themeOptions = [
    {
      value: 'light',
      label: 'Claro',
      icon: IoSunnyOutline,
      active: !isDark && !isAuto
    },
    {
      value: 'dark', 
      label: 'Escuro',
      icon: IoMoonOutline,
      active: isDark && !isAuto
    },
    {
      value: 'auto',
      label: 'Auto',
      icon: IoPhonePortraitOutline,
      active: isAuto
    }
  ];

  // Versão com apenas ícone (toggle simples)
  if (variant === 'icon') {
    return (
      <Button
        variant="secondary"
        size={size}
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className={`theme-toggle theme-toggle--icon ${className}`}
        title={`Alternar para tema ${isDark ? 'claro' : 'escuro'}`}
      >
        {isDark ? <IoSunnyOutline size={20} /> : <IoMoonOutline size={20} />}
      </Button>
    );
  }

  // Versão com menu dropdown
  if (variant === 'dropdown') {
    return (
      <div className={`theme-toggle theme-toggle--dropdown ${className}`}>
        <div className="theme-toggle__options">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.value}
                variant={option.active ? 'primary' : 'secondary'}
                size={size}
                onClick={() => setTheme(option.value)}
                className={`theme-toggle__option ${option.active ? 'theme-toggle__option--active' : ''}`}
                title={`Tema ${option.label}`}
              >
                <Icon size={16} />
                <span className="theme-toggle__label">{option.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    );
  }

  // Versão com botões inline
  return (
    <div className={`theme-toggle theme-toggle--inline ${className}`}>
      <span className="theme-toggle__title">Tema:</span>
      <div className="theme-toggle__options">
        {themeOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Button
              key={option.value}
              variant={option.active ? 'primary' : 'secondary'}
              size={size}
              onClick={() => setTheme(option.value)}
              className={`theme-toggle__option ${option.active ? 'theme-toggle__option--active' : ''}`}
            >
              <Icon size={16} />
              {variant === 'full' && <span>{option.label}</span>}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeToggle;