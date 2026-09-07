/**
 * Diza Teknik Servis — Gördit Bilgisayar
 * Copyright © 2024-2026 Gördit Bilgisayar — Zafer GÖRGÜN
 * Mobil & Tablet Dokunmatik Alt Menü
 */

import React from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Plus,
  KanbanSquare,
  Receipt,
} from 'lucide-react';
import type { ActiveTab } from './Sidebar';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenNewService: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenNewService,
}) => {
  return (
    <div className="bottom-nav">
      <button
        type="button"
        className={`bottom-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
        onClick={() => onSelectTab('dashboard')}
      >
        <LayoutDashboard size={20} />
        <span>Özet</span>
      </button>

      <button
        type="button"
        className={`bottom-nav-btn ${activeTab === 'services' ? 'active' : ''}`}
        onClick={() => onSelectTab('services')}
      >
        <ClipboardList size={20} />
        <span>Servisler</span>
      </button>

      {/* Ortadaki Yuvarlak Yeni Kabul Butonu */}
      <button
        type="button"
        className="bottom-nav-btn new-service-btn"
        onClick={onOpenNewService}
        title="Yeni Cihaz Kabul"
      >
        <Plus size={26} />
      </button>

      <button
        type="button"
        className={`bottom-nav-btn ${activeTab === 'kanban' ? 'active' : ''}`}
        onClick={() => onSelectTab('kanban')}
      >
        <KanbanSquare size={20} />
        <span>Kanban</span>
      </button>

      <button
        type="button"
        className={`bottom-nav-btn ${activeTab === 'cashier' ? 'active' : ''}`}
        onClick={() => onSelectTab('cashier')}
      >
        <Receipt size={20} />
        <span>Kasa</span>
      </button>
    </div>
  );
};
