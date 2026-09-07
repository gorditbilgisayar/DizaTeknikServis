/**
 * Diza Teknik Servis — Gördit Bilgisayar
 * Copyright © 2024-2026 Gördit Bilgisayar — Zafer GÖRGÜN
 * Sade, Anlaşılır ve Kolay Kullanımlı Dashboard
 */

import React from 'react';
import {
  Plus,
  Store,
  Truck,
  FileSpreadsheet,
  CheckCircle2,
  Receipt,
  Search,
  ChevronRight,
  Printer,
  Clock,
  Wrench,
  ArrowRight,
} from 'lucide-react';
import { useServices } from '../context/ServiceContext';
import { DURUMLAR, FAALIYET_ALANLARI } from '../lib/constants';
import { formatMoney, formatDateTime } from '../lib/format';
import type { TeknikServisItem } from '../types';

interface DashboardViewProps {
  onSelectService: (service: TeknikServisItem) => void;
  onOpenNewService: () => void;
  onGoToTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectService,
  onOpenNewService,
  onGoToTab,
}) => {
  const { services, cashMoves } = useServices();

  const aktifServisCount = services.filter(
    s => !['TeslimEdildi', 'IptalIade'].includes(s.durum)
  ).length;

  const islemdekiCount = services.filter(
    s => ['Incelemede', 'Tamirde', 'ParcaBekliyor'].includes(s.durum)
  ).length;

  const teklifCount = services.filter(s => s.islemTuru === 'Teklif').length;

  const hazirCount = services.filter(s => s.durum === 'Tamamlandi').length;

  const totalRevenue = cashMoves
    .filter(c => c.islemTuru === 'Gelir')
    .reduce((sum, c) => sum + c.tutar, 0);

  // Son 6 servis kaydı
  const recentServices = [...services].slice(0, 6);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Üst Karşılama ve Hızlı Eylem Bandı */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '16px 20px',
          borderLeft: '5px solid var(--diza-red)',
        }}
      >
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--diza-navy)' }}>
            Diza Teknik Servis Yönetim Paneli
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
            Güvenlik Kamerası, Alarm, Yangın, Bilgisayar, Network ve Yazılım Servis Yönetimi
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          style={{ fontSize: '15px', padding: '10px 20px', fontWeight: 700 }}
          onClick={onOpenNewService}
        >
          <Plus size={20} />
          <span>+ YENİ SERVİS KAYDI</span>
        </button>
      </div>

      {/* Sade ve Net 5 Ana Diza Karosu */}
      <div className="kpi-grid">
        {/* 1. Aktif Servisler */}
        <div
          className="kpi-card"
          onClick={() => onGoToTab('services')}
          style={{ cursor: 'pointer', borderTop: '3px solid var(--diza-navy)' }}
        >
          <div className="kpi-icon-box" style={{ background: '#e8eaf6', color: 'var(--diza-navy)' }}>
            <Wrench size={22} />
          </div>
          <div className="kpi-info">
            <h4>Aktif Servisler</h4>
            <div className="kpi-val" style={{ color: 'var(--diza-navy)' }}>{aktifServisCount}</div>
          </div>
        </div>

        {/* 2. İşlemde / Tamirde */}
        <div
          className="kpi-card"
          onClick={() => onGoToTab('services')}
          style={{ cursor: 'pointer', borderTop: '3px solid var(--diza-red)' }}
        >
          <div className="kpi-icon-box" style={{ background: 'var(--diza-red-light)', color: 'var(--diza-red)' }}>
            <Clock size={22} />
          </div>
          <div className="kpi-info">
            <h4>İşlemde / Onarımda</h4>
            <div className="kpi-val" style={{ color: 'var(--diza-red)' }}>{islemdekiCount}</div>
          </div>
        </div>

        {/* 3. Teklifler */}
        <div
          className="kpi-card"
          onClick={() => onGoToTab('services')}
          style={{ cursor: 'pointer', borderTop: '3px solid #d97706' }}
        >
          <div className="kpi-icon-box" style={{ background: '#fef3c7', color: '#d97706' }}>
            <FileSpreadsheet size={22} />
          </div>
          <div className="kpi-info">
            <h4>Fiyat Teklifleri</h4>
            <div className="kpi-val" style={{ color: '#d97706' }}>{teklifCount}</div>
          </div>
        </div>

        {/* 4. Hazır / Montaj Bitti */}
        <div
          className="kpi-card"
          onClick={() => onGoToTab('kanban')}
          style={{ cursor: 'pointer', borderTop: '3px solid var(--diza-green)' }}
        >
          <div className="kpi-icon-box" style={{ background: 'var(--diza-green-light)', color: 'var(--diza-green)' }}>
            <CheckCircle2 size={22} />
          </div>
          <div className="kpi-info">
            <h4>Hazır / Montaj Bitti</h4>
            <div className="kpi-val" style={{ color: 'var(--diza-green)' }}>{hazirCount}</div>
          </div>
        </div>

        {/* 5. Kasa Tahsilatı */}
        <div
          className="kpi-card"
          onClick={() => onGoToTab('cashier')}
          style={{ cursor: 'pointer', borderTop: '3px solid #0284c7' }}
        >
          <div className="kpi-icon-box" style={{ background: '#e0f2fe', color: '#0284c7' }}>
            <Receipt size={22} />
          </div>
          <div className="kpi-info">
            <h4>Toplam Tahsilat</h4>
            <div className="kpi-val" style={{ fontSize: '17px', color: '#0284c7' }}>
              {formatMoney(totalRevenue)}
            </div>
          </div>
        </div>
      </div>

      {/* Son Servisler ve Kolay Liste */}
      <div className="glass-card" style={{ padding: '16px 20px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px',
            paddingBottom: '10px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
              Son Servis & Montaj Kayıtları
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              En son işlem gören veya kayıt açılan cihazlar
            </p>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onGoToTab('services')}
          >
            <span>Tümünü Gör ({services.length})</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Tablo Görünümü */}
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Servis No</th>
                <th>Servis Türü</th>
                <th>Müşteri / Firma</th>
                <th>Cihaz / Sistem Modeli</th>
                <th>Durum</th>
                <th>Tutar</th>
                <th style={{ textAlign: 'right' }}>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {recentServices.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    Henüz kayıtlı bir servis bulunmamaktadır.
                  </td>
                </tr>
              ) : (
                recentServices.map(item => {
                  const meta = DURUMLAR[item.durum] || DURUMLAR.KabulEdildi;
                  const faal = FAALIYET_ALANLARI[item.faaliyetAlani];

                  return (
                    <tr
                      key={item.id}
                      onClick={() => onSelectService(item)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <strong style={{ color: 'var(--diza-navy)', fontWeight: 700 }}>
                          {item.servisNo}
                        </strong>
                      </td>
                      <td>
                        <span className={`badge ${faal?.badge || 'badge-primary'}`} style={{ fontSize: '11px' }}>
                          {faal?.label || item.faaliyetAlani}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{item.musteriAdSoyad}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {item.musteriTelefon}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{item.markaModel}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-dim)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.arizaTanimi}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${meta.badgeClass}`}>
                          {meta.label}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: item.kalanTutar > 0 ? 'var(--diza-red)' : 'var(--diza-green)' }}>
                          {formatMoney(item.toplamTutar)}
                        </strong>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={e => {
                            e.stopPropagation();
                            onSelectService(item);
                          }}
                        >
                          Aç
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
