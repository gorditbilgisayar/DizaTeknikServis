/**
 * Diza Teknik Servis — Gördit Bilgisayar
 * Copyright © 2024-2026 Gördit Bilgisayar — Zafer GÖRGÜN
 */

import React from 'react';
import {
  Wrench,
  Search,
  Plus,
  Sun,
  Moon,
  ExternalLink,
} from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenNewService: () => void;
  onOpenCustomerPortal: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenNewService,
  onOpenCustomerPortal,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="top-navbar">
      <div className="brand-badge">
        <div className="brand-logo-icon">
          <Wrench size={22} />
        </div>
        <div className="brand-info">
          <h2>Diza Servis</h2>
          <span>Gördit Bilgisayar</span>
        </div>
      </div>

      <div className="search-input-wrapper">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          placeholder="Servis no, müşteri, telefon veya marka ara..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onOpenCustomerPortal}
          title="Müşteri Cihaz Sorgulama Portalı"
        >
          <ExternalLink size={16} />
          <span className="hide-mobile">Müşteri Portalı</span>
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={onOpenNewService}
        >
          <Plus size={18} />
          <span className="hide-mobile">Yeni Cihaz Kabul</span>
        </button>

        <button
          type="button"
          className="btn btn-secondary btn-icon"
          onClick={onToggleTheme}
          title="Koyu / Açık Tema"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
};
