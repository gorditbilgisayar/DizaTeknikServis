/**
 * Diza Teknik Servis — Gördit Bilgisayar
 * Copyright © 2024-2026 Gördit Bilgisayar — Zafer GÖRGÜN
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  TeknikServisItem,
  TeknikServisDurumu,
  StokParca,
  Teknisyen,
  KasaHareketi,
  FirmaAyarlari,
  ServisSatiri,
} from '../types';
import { initialServices, initialParts, initialTechnicians, initialSettings, initialCashMoves } from './initialData';

interface ServiceContextType {
  services: TeknikServisItem[];
  technicians: Teknisyen[];
  stockParts: StokParca[];
  cashMoves: KasaHareketi[];
  companySettings: FirmaAyarlari;

  // Servis İşlemleri
  addService: (item: Omit<TeknikServisItem, 'id' | 'servisNo' | 'gelisTarihi'>) => TeknikServisItem;
  updateService: (id: string, updates: Partial<TeknikServisItem>) => void;
  updateServiceStatus: (id: string, newStatus: TeknikServisDurumu, notes?: string) => void;
  deleteService: (id: string) => void;
  addServiceLine: (serviceId: string, line: Omit<ServisSatiri, 'id'>) => void;
  removeServiceLine: (serviceId: string, lineId: string) => void;

  // Kasa & Tahsilat
  addCashMovement: (movement: Omit<KasaHareketi, 'id' | 'tarih'>) => void;

  // Stok Parça
  addStockPart: (part: Omit<StokParca, 'id'>) => void;
  updateStockPart: (id: string, updates: Partial<StokParca>) => void;

  // Ayarlar
  updateCompanySettings: (settings: Partial<FirmaAyarlari>) => void;

  // Veri Yedekleme & Geri Yükleme
  exportDatabaseJson: () => string;
  importDatabaseJson: (jsonStr: string) => boolean;
  resetToSampleData: () => void;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

const LS_KEY_SERVICES = 'diza_servis_items_v1';
const LS_KEY_TECHS = 'diza_servis_techs_v1';
const LS_KEY_STOCK = 'diza_servis_stock_v1';
const LS_KEY_CASH = 'diza_servis_cash_v1';
const LS_KEY_SETTINGS = 'diza_servis_settings_v1';

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<TeknikServisItem[]>(() => {
    try {
      const saved = localStorage.getItem(LS_KEY_SERVICES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialServices;
  });

  const [technicians, setTechnicians] = useState<Teknisyen[]>(() => {
    try {
      const saved = localStorage.getItem(LS_KEY_TECHS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialTechnicians;
  });

  const [stockParts, setStockParts] = useState<StokParca[]>(() => {
    try {
      const saved = localStorage.getItem(LS_KEY_STOCK);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialParts;
  });

  const [cashMoves, setCashMoves] = useState<KasaHareketi[]>(() => {
    try {
      const saved = localStorage.getItem(LS_KEY_CASH);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialCashMoves;
  });

  const [companySettings, setCompanySettings] = useState<FirmaAyarlari>(() => {
    try {
      const saved = localStorage.getItem(LS_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialSettings;
  });

  // LocalStorage senkronizasyonları
  useEffect(() => {
    localStorage.setItem(LS_KEY_SERVICES, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(LS_KEY_TECHS, JSON.stringify(technicians));
  }, [technicians]);

  useEffect(() => {
    localStorage.setItem(LS_KEY_STOCK, JSON.stringify(stockParts));
  }, [stockParts]);

  useEffect(() => {
    localStorage.setItem(LS_KEY_CASH, JSON.stringify(cashMoves));
  }, [cashMoves]);

  useEffect(() => {
    localStorage.setItem(LS_KEY_SETTINGS, JSON.stringify(companySettings));
  }, [companySettings]);

  // Yeni Servis Ekleme
  const addService = (item: Omit<TeknikServisItem, 'id' | 'servisNo' | 'gelisTarihi'>): TeknikServisItem => {
    const nextNo = (companySettings.sonServisNo || 100) + 1;
    const year = new Date().getFullYear();
    const formattedNo = `${companySettings.servisNoOnEk || 'TS'}-${year}-${String(nextNo).padStart(4, '0')}`;

    const newService: TeknikServisItem = {
      ...item,
      id: 'srv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      servisNo: formattedNo,
      gelisTarihi: new Date().toISOString(),
    };

    setCompanySettings(prev => ({ ...prev, sonServisNo: nextNo }));
    setServices(prev => [newService, ...prev]);

    // Kapora varsa kasaya gelir işle
    if (newService.alinanKapora > 0) {
      addCashMovement({
        islemTuru: 'Gelir',
        kategori: 'Kapora',
        aciklama: `${newService.servisNo} Kapora Tahsilatı (${newService.musteriAdSoyad})`,
        tutar: newService.alinanKapora,
        odemeTuru: newService.odemeTuru || 'Nakit',
        servisId: newService.id,
        servisNo: newService.servisNo,
      });
    }

    return newService;
  };

  // Servis Güncelleme
  const updateService = (id: string, updates: Partial<TeknikServisItem>) => {
    setServices(prev =>
      prev.map(s => {
        if (s.id !== id) return s;
        const updated = { ...s, ...updates };

        // Finansal toplamları yeniden hesapla
        if (updates.satirlar || updates.iscilikUcreti !== undefined || updates.indirimTutari !== undefined || updates.alinanKapora !== undefined) {
          const parcaTop = (updated.satirlar || []).reduce((sum, line) => sum + (line.tur === 'Parca' ? line.toplamTutar : 0), 0);
          const iscilikTop = (updated.satirlar || []).reduce((sum, line) => sum + (line.tur === 'Iscilik' ? line.toplamTutar : 0), 0) + (updated.iscilikUcreti || 0);
          const kdvTop = (updated.satirlar || []).reduce((sum, line) => sum + (line.toplamTutar * (line.kdvOrani / 100)), 0);
          const genel = parcaTop + iscilikTop + kdvTop - (updated.indirimTutari || 0);
          const kalan = Math.max(0, genel - (updated.alinanKapora || 0));

          updated.parcaUcreti = parcaTop;
          updated.iscilikUcreti = iscilikTop;
          updated.kdvTutari = kdvTop;
          updated.toplamTutar = genel;
          updated.kalanTutar = kalan;
        }
        return updated;
      })
    );
  };

  // Servis Durumu Değiştirme
  const updateServiceStatus = (id: string, newStatus: TeknikServisDurumu, notes?: string) => {
    setServices(prev =>
      prev.map(s => {
        if (s.id !== id) return s;
        const updates: Partial<TeknikServisItem> = { durum: newStatus };
        if (newStatus === 'Tamamlandi') {
          updates.tamamlanmaTarihi = new Date().toISOString();
        }
        if (newStatus === 'TeslimEdildi') {
          updates.teslimTarihi = new Date().toISOString();
          // Eğer teslim anında bakiye varsa ve tahsil edildi işaretlenirse
          if (s.kalanTutar > 0 && !s.tahsilEdildi) {
            updates.tahsilEdildi = true;
            addCashMovement({
              islemTuru: 'Gelir',
              kategori: 'ServisTahsilat',
              aciklama: `${s.servisNo} Kalan Bakiye Tahsilatı (${s.musteriAdSoyad})`,
              tutar: s.kalanTutar,
              odemeTuru: s.odemeTuru || 'Nakit',
              servisId: s.id,
              servisNo: s.servisNo,
            });
          }
        }
        if (notes) {
          updates.dahiliNotlar = (s.dahiliNotlar ? s.dahiliNotlar + '\n' : '') + `[${new Date().toLocaleTimeString('tr-TR')}] ${notes}`;
        }
        return { ...s, ...updates };
      })
    );
  };

  // Servis Silme
  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  // Servis Satırı Ekleme (Parça veya İşçilik)
  const addServiceLine = (serviceId: string, line: Omit<ServisSatiri, 'id'>) => {
    const newLine: ServisSatiri = {
      ...line,
      id: 'line_' + Date.now(),
    };
    const srv = services.find(s => s.id === serviceId);
    if (!srv) return;
    const newSatirlar = [...(srv.satirlar || []), newLine];
    updateService(serviceId, { satirlar: newSatirlar });

    // Eğer stok parça ise ve stok listesinde varsa stok miktarını düşür
    if (line.tur === 'Parca') {
      setStockParts(prev =>
        prev.map(p => {
          if (p.ad.toLowerCase() === line.tanim.toLowerCase()) {
            return { ...p, stokAdedi: Math.max(0, p.stokAdedi - line.adet) };
          }
          return p;
        })
      );
    }
  };

  // Servis Satırı Çıkarma
  const removeServiceLine = (serviceId: string, lineId: string) => {
    const srv = services.find(s => s.id === serviceId);
    if (!srv) return;
    const newSatirlar = (srv.satirlar || []).filter(l => l.id !== lineId);
    updateService(serviceId, { satirlar: newSatirlar });
  };

  // Kasa Hareketi Ekleme
  const addCashMovement = (movement: Omit<KasaHareketi, 'id' | 'tarih'>) => {
    const newMove: KasaHareketi = {
      ...movement,
      id: 'cash_' + Date.now(),
      tarih: new Date().toISOString(),
    };
    setCashMoves(prev => [newMove, ...prev]);
  };

  // Stok Parça Ekleme / Güncelleme
  const addStockPart = (part: Omit<StokParca, 'id'>) => {
    const newPart: StokParca = {
      ...part,
      id: 'stk_' + Date.now(),
    };
    setStockParts(prev => [...prev, newPart]);
  };

  const updateStockPart = (id: string, updates: Partial<StokParca>) => {
    setStockParts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  // Ayarlar Güncelleme
  const updateCompanySettings = (settings: Partial<FirmaAyarlari>) => {
    setCompanySettings(prev => ({ ...prev, ...settings }));
  };

  // Veritabanı Dışa Aktar (JSON)
  const exportDatabaseJson = (): string => {
    const data = {
      exportDate: new Date().toISOString(),
      developer: 'Gördit Bilgisayar - Zafer GÖRGÜN',
      version: '1.0.0',
      services,
      technicians,
      stockParts,
      cashMoves,
      companySettings,
    };
    return JSON.stringify(data, null, 2);
  };

  // Veritabanı İçe Aktar (JSON)
  const importDatabaseJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.services) setServices(data.services);
      if (data.technicians) setTechnicians(data.technicians);
      if (data.stockParts) setStockParts(data.stockParts);
      if (data.cashMoves) setCashMoves(data.cashMoves);
      if (data.companySettings) setCompanySettings(data.companySettings);
      return true;
    } catch (e) {
      console.error('Yedek yüklenirken hata:', e);
      return false;
    }
  };

  // Örnek Verilere Sıfırla
  const resetToSampleData = () => {
    setServices(initialServices);
    setTechnicians(initialTechnicians);
    setStockParts(initialParts);
    setCashMoves(initialCashMoves);
    setCompanySettings(initialSettings);
  };

  return (
    <ServiceContext.Provider
      value={{
        services,
        technicians,
        stockParts,
        cashMoves,
        companySettings,
        addService,
        updateService,
        updateServiceStatus,
        deleteService,
        addServiceLine,
        removeServiceLine,
        addCashMovement,
        addStockPart,
        updateStockPart,
        updateCompanySettings,
        exportDatabaseJson,
        importDatabaseJson,
        resetToSampleData,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useServices = () => {
  const ctx = useContext(ServiceContext);
  if (!ctx) throw new Error('useServices ServiceProvider içinde kullanılmalıdır.');
  return ctx;
};
