/**
 * Diza Teknik Servis — Gördit Bilgisayar
 * Copyright © 2024-2026 Gördit Bilgisayar — Zafer GÖRGÜN
 * Ana Uygulama Kabuğu
 */

import React, { useState, useEffect } from 'react';
import './App.css';
import { ServiceProvider } from './context/ServiceContext';
import { Navbar } from './components/Navbar';
import { Sidebar, type ActiveTab } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { ServiceListView } from './components/ServiceListView';
import { KanbanView } from './components/KanbanView';
import { CashierView } from './components/CashierView';
import { StockView } from './components/StockView';
import { SettingsView } from './components/SettingsView';
import { NewServiceModal } from './components/NewServiceModal';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { PrintModal } from './components/PrintModal';
import { CustomerPortalModal } from './components/CustomerPortalModal';
import type { TeknikServisItem } from './types';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Modallar
  const [isNewServiceOpen, setIsNewServiceOpen] = useState(false);
  const [isCustomerPortalOpen, setIsCustomerPortalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<TeknikServisItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [printService, setPrintService] = useState<TeknikServisItem | null>(null);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleOpenDetail = (service: TeknikServisItem) => {
    setSelectedService(service);
    setIsDetailOpen(true);
  };

  const handleOpenPrint = (service: TeknikServisItem) => {
    setPrintService(service);
    setIsPrintOpen(true);
  };

  const handleServiceCreated = (newService: TeknikServisItem) => {
    setSelectedService(newService);
    // Yeni oluşturulan cihaz için yazdırma seçeneği sun
    if (confirm(`Servis kaydı oluşturuldu: ${newService.servisNo}\nServis Kabul Fişini hemen yazdırmak ister misiniz?`)) {
      setPrintService(newService);
      setIsPrintOpen(true);
    }
  };

  return (
    <div className="app-container">
      {/* Yan Menü (Masaüstü & Tablet) */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={tab => {
          if (tab === 'portal') {
            setIsCustomerPortalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
      />

      {/* Ana İçerik Alanı */}
      <div className="main-content">
        <Navbar
          searchQuery={searchQuery}
          onSearchChange={q => {
            setSearchQuery(q);
            if (q.trim() && activeTab !== 'services') {
              setActiveTab('services');
            }
          }}
          onOpenNewService={() => setIsNewServiceOpen(true)}
          onOpenCustomerPortal={() => setIsCustomerPortalOpen(true)}
          theme={theme}
          onToggleTheme={() => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))}
        />

        <main className="page-body">
          {activeTab === 'dashboard' && (
            <DashboardView
              onSelectService={handleOpenDetail}
              onOpenNewService={() => setIsNewServiceOpen(true)}
              onGoToTab={tab => setActiveTab(tab)}
            />
          )}

          {activeTab === 'services' && (
            <ServiceListView
              searchQuery={searchQuery}
              onSelectService={handleOpenDetail}
              onOpenPrint={handleOpenPrint}
              selectedServiceId={selectedService?.id}
            />
          )}

          {activeTab === 'kanban' && (
            <KanbanView
              onSelectService={handleOpenDetail}
              onOpenPrint={handleOpenPrint}
            />
          )}

          {activeTab === 'cashier' && <CashierView />}

          {activeTab === 'stock' && <StockView />}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Alt Dokunmatik Gezinme (Mobil & Tablet) */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={tab => setActiveTab(tab)}
        onOpenNewService={() => setIsNewServiceOpen(true)}
      />

      {/* Modallar */}
      <NewServiceModal
        isOpen={isNewServiceOpen}
        onClose={() => setIsNewServiceOpen(false)}
        onSuccess={handleServiceCreated}
      />

      <ServiceDetailModal
        isOpen={isDetailOpen}
        service={selectedService}
        onClose={() => setIsDetailOpen(false)}
        onOpenPrint={handleOpenPrint}
      />

      <PrintModal
        isOpen={isPrintOpen}
        service={printService}
        onClose={() => setIsPrintOpen(false)}
      />

      <CustomerPortalModal
        isOpen={isCustomerPortalOpen}
        onClose={() => setIsCustomerPortalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ServiceProvider>
      <MainApp />
    </ServiceProvider>
  );
}
