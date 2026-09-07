/**
 * Diza Teknik Servis — Gördit Bilgisayar
 * Copyright © 2024-2026 Gördit Bilgisayar — Zafer GÖRGÜN
 */

import React from 'react';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Boxes,
  ArrowUpRight,
  Plus,
  Flame,
  Store,
  Truck,
  FileSpreadsheet,
} from 'lucide-react';
import { useServices } from '../context/ServiceContext';
import { DURUMLAR } from '../lib/constants';
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

  const activeServices = services.filter(s => !['TeslimEdildi', 'IptalIade'].includes(s.durum));
  const icServisCount = services.filter(s => s.servisTuru === 'IcServis' && !['TeslimEdildi', 'IptalIade'].includes(s.durum)).length;
  const disServisCount = services.filter(s => s.servisTuru === 'DisServis' && !['TeslimEdildi', 'IptalIade'].includes(s.durum)).length;
  const teklifCount = services.filter(s => s.islemTuru === 'Teklif').length;
  const waitingApproval = services.filter(s => s.durum === 'OnayBekliyor');
  const waitingParts = services.filter(s => s.durum === 'ParcaBekliyor');
  const completedReady = services.filter(s => s.durum === 'Tamamlandi');
  const urgentServices = services.filter(s => s.oncelik === 'Kritik' || s.oncelik === 'Acil');

  // Finansal özet
  const totalRevenue = cashMoves
    .filter(c => c.islemTuru === 'Gelir')
    .reduce((sum, c) => sum + c.tutar, 0);

  const pendingReceivables = activeServices.reduce((sum, s) => sum + s.kalanTutar, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Karşılama ve Hızlı Başlat */}
      <div
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(227, 6, 19, 0.16) 0%, rgba(26, 35, 126, 0.4) 100%)',
          borderLeft: '4px solid #e30613',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#fff' }}>
            Diza Teknik Servis & Güvenlik & Network Paneli
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '13px', marginTop: '4px' }}>
            Kamera, Alarm, Yangın, Bilgisayar, Network ve Yazılım için İç (Atölye) ve Dış (Saha / Montaj) süreç yönetimi.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpenNewService}
          >
            <Plus size={18} />
            <span>Yeni Kayıt & Montaj</span>
          </button>
        </div>
      </div>

      {/* KPI Kartları Grid */}
      <div className="kpi-grid">
        <div className="kpi-card" onClick={() => onGoToTab('services')} style={{ cursor: 'pointer' }}>
          <div className="kpi-icon-box" style={{ background: 'rgba(26, 35, 126, 0.3)', color: '#818cf8' }}>
            <Store size={22} />
          </div>
          <div className="kpi-info">
            <h4>İç Servis (Atölye)</h4>
            <div className="kpi-val">{icServisCount}</div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => onGoToTab('services')} style={{ cursor: 'pointer' }}>
          <div className="kpi-icon-box" style={{ background: 'rgba(227, 6, 19, 0.2)', color: '#ff6b72' }}>
            <Truck size={22} />
          </div>
          <div className="kpi-info">
            <h4>Dış Servis (Saha / Montaj)</h4>
            <div className="kpi-val">{disServisCount}</div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => onGoToTab('services')} style={{ cursor: 'pointer' }}>
          <div className="kpi-icon-box" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <FileSpreadsheet size={22} />
          </div>
          <div className="kpi-info">
            <h4>Teklifler & Keşif</h4>
            <div className="kpi-val">{teklifCount}</div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => onGoToTab('kanban')} style={{ cursor: 'pointer' }}>
          <div className="kpi-icon-box" style={{ background: 'rgba(46, 125, 50, 0.2)', color: '#4ade80' }}>
            <CheckCircle2 size={22} />
          </div>
          <div className="kpi-info">
            <h4>Hazır / Montaj Bitti</h4>
            <div className="kpi-val">{completedReady.length}</div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => onGoToTab('cashier')} style={{ cursor: 'pointer' }}>
          <div className="kpi-icon-box" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <Receipt size={22} />
          </div>
          <div className="kpi-info">
            <h4>Kasa Tahsilatı</h4>
            <div className="kpi-val" style={{ fontSize: '18px' }}>{formatMoney(totalRevenue)}</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box" style={{ background: 'rgba(225, 29, 72, 0.15)', color: '#fb7185' }}>
            <AlertTriangle size={22} />
          </div>
          <div className="kpi-info">
            <h4>Kalan Bakiye</h4>
            <div className="kpi-val" style={{ fontSize: '18px' }}>{formatMoney(pendingReceivables)}</div>
          </div>
        </div>
      </div>

      {/* İki Kolonlu Alt Düzen: Acil Cihazlar & Durum Dağılımı */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Acil ve Kritik Cihazlar */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={18} color="#ef4444" />
              Öncelikli & Kritik Cihazlar
            </h3>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>{urgentServices.length} Cihaz</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {urgentServices.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '13px', padding: '16px', textAlign: 'center' }}>
                Şu an acil veya kritik öncelikli servis kaydı bulunmuyor.
              </p>
            ) : (
              urgentServices.map(item => {
                const meta = DURUMLAR[item.durum] || DURUMLAR.KabulEdildi;
                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectService(item)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '13px', color: '#fff' }}>{item.servisNo}</strong>
                        <span className={`badge ${meta.badgeClass}`} style={{ fontSize: '10px', padding: '2px 6px' }}>
                          {meta.label}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '2px' }}>
                        {item.markaModel} — {item.musteriAdSoyad}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', color: '#f87171', fontWeight: 700 }}>
                        {item.oncelik.toUpperCase()}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                        {formatDateTime(item.gelisTarihi)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Canlı Servis Durum Dağılımı */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px' }}>Durum Dağılımı</h3>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => onGoToTab('kanban')}
            >
              Kanban Aç <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(DURUMLAR).map(([key, meta]) => {
              const count = services.filter(s => s.durum === key).length;
              const percent = services.length > 0 ? Math.round((count / services.length) * 100) : 0;
              return (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: meta.color }} />
                      {meta.label}
                    </span>
                    <span style={{ fontWeight: 600, color: '#fff' }}>
                      {count} adet ({percent}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${percent}%`,
                        height: '100%',
                        background: meta.color,
                        borderRadius: '3px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
