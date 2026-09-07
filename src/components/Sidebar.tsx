/**
 * Diza Teknik Servis — Gördit Bilgisayar
 * Copyright © 2024-2026 Gördit Bilgisayar — Zafer GÖRGÜN
 */

import React from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  KanbanSquare,
  Receipt,
  Boxes,
  Globe,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { useServices } from '../context/ServiceContext';

export type ActiveTab = 'dashboard' | 'services' | 'kanban' | 'cashier' | 'stock' | 'portal' | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const { services, stockParts } = useServices();

  const activeCount = services.filter(s => !['TeslimEdildi', 'IptalIade'].includes(s.durum)).length;
  const criticalStockCount = stockParts.filter(p => p.stokAdedi <= p.kritikStok).length;

  return (
    <aside className="app-sidebar">
      <div className="sidebar-header">
        <div className="brand-logo-icon">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Diza Yazılım</h3>
          <p style={{ fontSize: '11px', color: '#94a3b8' }}>Teknik Servis v1.0.0</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button
          type="button"
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => onSelectTab('dashboard')}
        >
          <LayoutDashboard size={20} />
          <span>Genel Bakış</span>
        </button>

        <button
          type="button"
          className={`nav-item ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => onSelectTab('services')}
        >
          <ClipboardList size={20} />
          <span>Servis Listesi</span>
          {activeCount > 0 && <span className="nav-badge-count">{activeCount}</span>}
        </button>

        <button
          type="button"
          className={`nav-item ${activeTab === 'kanban' ? 'active' : ''}`}
          onClick={() => onSelectTab('kanban')}
        >
          <KanbanSquare size={20} />
          <span>Kanban Panosu</span>
        </button>

        <button
          type="button"
          className={`nav-item ${activeTab === 'cashier' ? 'active' : ''}`}
          onClick={() => onSelectTab('cashier')}
        >
          <Receipt size={20} />
          <span>Kasa & Tahsilat</span>
        </button>

        <button
          type="button"
          className={`nav-item ${activeTab === 'stock' ? 'active' : ''}`}
          onClick={() => onSelectTab('stock')}
        >
          <Boxes size={20} />
          <span>Yedek Parça Stok</span>
          {criticalStockCount > 0 && (
            <span className="nav-badge-count" style={{ background: '#ef4444' }}>
              {criticalStockCount}
            </span>
          )}
        </button>

        <button
          type="button"
          className={`nav-item ${activeTab === 'portal' ? 'active' : ''}`}
          onClick={() => onSelectTab('portal')}
        >
          <Globe size={20} />
          <span>Müşteri Sorgulama</span>
        </button>

        <button
          type="button"
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => onSelectTab('settings')}
        >
          <Settings size={20} />
          <span>Ayarlar & Yedek</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <div style={{ fontWeight: 600, color: '#cbd5e1' }}>Gördit Bilgisayar</div>
        <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
          Zafer GÖRGÜN — Tüm Hakları Saklıdır
        </div>
      </div>
    </aside>
  );
};
