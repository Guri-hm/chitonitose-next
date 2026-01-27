'use client';

import { useState, useEffect } from 'react';
import LightModeIcon from '../icons/LightModeIcon';
import DarkModeIcon from '../icons/DarkModeIcon';
import './ThemeSwitch.css';

interface ThemeSwitchProps {
  onChange?: (checked: boolean) => void;
  defaultChecked?: boolean;
}

export default function ThemeSwitch({ onChange, defaultChecked = false }: ThemeSwitchProps) {
  const [checked, setChecked] = useState(defaultChecked);

  useEffect(() => {
    // 初期化時にローカルストレージから読み込み
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    setChecked(isDark);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    setChecked(newChecked);
    if (onChange) {
      onChange(newChecked);
    }
  };

  return (
    <label className="theme-switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="theme-switch-input"
      />
      <span className="theme-switch-slider">
        <span className="theme-switch-icon theme-switch-icon-light">
          <LightModeIcon fill="#fff" />
        </span>
        <span className="theme-switch-icon theme-switch-icon-dark">
          <DarkModeIcon fill="#fff" />
        </span>
      </span>
    </label>
  );
}
