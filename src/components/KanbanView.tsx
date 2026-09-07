/**
 * Diza Teknik Servis — Gördit Bilgisayar
 * Copyright © 2024-2026 Gördit Bilgisayar — Zafer GÖRGÜN
 * Canlı Kanban İş Akışı Panosu
 */

import React from 'react';
import {
  ChevronRight,
  Printer,
  MessageCircle,
} from 'lucide-react';
import { useServices } from '../context/ServiceContext';
import { DURUMLAR } from '../lib/constants';
import { formatMoney, buildWhatsAppLink } from '../lib/format';
import type { TeknikServisItem, TeknikServisDurumu } from '../types';

interface KanbanViewProps {
  onSelectService: (service: TeknikServisItem) => void;
  onOpenPrint: (service: TeknikServisItem) => void;
}

const KANBAN_COLUMNS: TeknikServisDurumu[] = [
  'KabulEdildi',
  'Incelemede',
  'OnayBekliyor',
  'ParcaBekliyor',
  'Tamirde',
  'Tamamlandi',
  'TeslimEdildi',
];

export const KanbanView: React.FC<KanbanViewProps> = ({
  onSelectService,
  onOpenPrint,
}) => {
  const { services, updateServiceStatus } = useServices();

  const getNextStatus = (current: TeknikServisDurumu): TeknikServisDurumu | null => {
    switch (current) {
      case 'KabulEdildi':
        return 'Incelemede';
      case 'Incelemede':
        return 'OnayBekliyor';
      case 'OnayBekliyor':
        return 'Tamirde';
      case 'ParcaBekliyor':
        return 'Tamirde';
      case 'Tamirde':
        return 'Tamamlandi';
      case 'Tamamlandi':
        return 'TeslimEdildi';
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Servis Süreç Panosu (Kanban)</h2>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
            Cihazların servis aşamalarını yatay panoda takip edin ve durumlarını tek tıkla ilerletin.
          </p>
        </div>
      </div>

      <div className="kanban-board">
        {KANBAN_COLUMNS.map(columnKey => {
          const meta = DURUMLAR[columnKey];
          const columnItems = services.filter(s => s.durum === columnKey);

          return (
            <div key={columnKey} className="kanban-column">
              <div className="kanban-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: meta.color,
                    }}
                  />
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{meta.label}</h4>
                </div>
                <span
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    color: '#fff',
                  }}
                >
                  {columnItems.length}
                </span>
              </div>

              <div className="kanban-list">
                {columnItems.length === 0 ? (
                  <div
                    style={{
                      padding: '24px 12px',
                      textAlign: 'center',
                      color: '#475569',
                      fontSize: '12px',
                      border: '1px dashed rgba(255,255,255,0.06)',
                      borderRadius: '8px',
                    }}
                  >
                    Bu aşamada cihaz yok
                  </div>
                ) : (
                  columnItems.map(item => {
                    const nextSt = getNextStatus(item.durum);
                    return (
                      <div
                        key={item.id}
                        className="kanban-card"
                        onClick={() => onSelectService(item)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 800, fontSize: '12px', color: '#38bdf8' }}>
                            {item.servisNo}
                          </span>
                          {item.oncelik !== 'Normal' && (
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                color: item.oncelik === 'Kritik' ? '#ef4444' : '#f59e0b',
                                background: item.oncelik === 'Kritik' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                padding: '1px 6px',
                                borderRadius: '4px',
                              }}
                            >
                              {item.oncelik}
                            </span>
                          )}
                        </div>

                        <div style={{ fontWeight: 700, fontSize: '13px', color: '#fff' }}>
                          {item.musteriAdSoyad}
                        </div>

                        <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '2px' }}>
                          {item.markaModel}
                        </div>

                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', background: 'rgba(0,0,0,0.25)', padding: '6px 8px', borderRadius: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.arizaTanimi}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', fontSize: '11px', color: '#94a3b8' }}>
                          <span>{item.atananTeknisyenAd || 'Atanmadı'}</span>
                          <strong style={{ color: item.kalanTutar > 0 ? '#fb7185' : '#34d399' }}>
                            {formatMoney(item.kalanTutar)}
                          </strong>
                        </div>

                        {/* Kart Altı Hızlı Butonlar */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: '10px',
                            paddingTop: '8px',
                            borderTop: '1px solid rgba(255,255,255,0.06)',
                          }}
                        >
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              style={{ height: '26px', padding: '0 6px' }}
                              onClick={e => {
                                e.stopPropagation();
                                onOpenPrint(item);
                              }}
                              title="Yazdır"
                            >
                              <Printer size={12} />
                            </button>
                            <button
                              type="button"
                              className="btn btn-whatsapp btn-sm"
                              style={{ height: '26px', padding: '0 6px' }}
                              onClick={e => {
                                e.stopPropagation();
                                const msg = `Sayın ${item.musteriAdSoyad}, ${item.servisNo} numaralı ${item.markaModel} cihazınız servisimizde '${meta.label}' aşamasındadır. — Gördit Bilgisayar`;
                                window.open(buildWhatsAppLink(item.musteriTelefon, msg), '_blank');
                              }}
                              title="WhatsApp"
                            >
                              <MessageCircle size={12} />
                            </button>
                          </div>

                          {nextSt && (
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              style={{ height: '26px', padding: '0 8px', fontSize: '11px' }}
                              onClick={e => {
                                e.stopPropagation();
                                updateServiceStatus(item.id, nextSt);
                              }}
                            >
                              İlerlet <ChevronRight size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
