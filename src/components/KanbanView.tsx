/**
 * Diza Teknik Servis — Gördit Bilgisayar
 * Copyright © 2024-2026 Gördit Bilgisayar — Zafer GÖRGÜN
 * Sade, Kolay ve Okunaklı Canlı Kanban Panosu
 */

import React from 'react';
import {
  ChevronRight,
  Printer,
  MessageCircle,
  Store,
  Truck,
} from 'lucide-react';
import { useServices } from '../context/ServiceContext';
import { DURUMLAR, FAALIYET_ALANLARI } from '../lib/constants';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--diza-navy)' }}>
            Servis Süreç Panosu (Kanban)
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Cihaz ve montajların servis aşamalarını yatay panoda takip edin ve durumlarını tek tıkla ilerletin.
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
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                    {meta.label}
                  </h4>
                </div>
                <span
                  style={{
                    background: 'var(--border-light)',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    color: 'var(--text-main)',
                  }}
                >
                  {columnItems.length}
                </span>
              </div>

              <div className="kanban-list">
                {columnItems.length === 0 ? (
                  <div
                    style={{
                      padding: '20px 10px',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      fontSize: '12px',
                      border: '1px dashed var(--border)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    Bu aşamada kayıt yok
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
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ fontWeight: 800, fontSize: '12px', color: 'var(--diza-navy)' }}>
                              {item.servisNo}
                            </span>
                            <span className={`badge ${item.servisTuru === 'DisServis' ? 'badge-danger' : 'badge-primary'}`} style={{ fontSize: '9px', padding: '1px 4px' }}>
                              {item.servisTuru === 'DisServis' ? 'Saha' : 'Atölye'}
                            </span>
                          </div>
                          {item.oncelik !== 'Normal' && (
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                color: item.oncelik === 'Kritik' ? 'var(--diza-red)' : '#d97706',
                                background: item.oncelik === 'Kritik' ? 'var(--diza-red-light)' : '#fef3c7',
                                padding: '1px 5px',
                                borderRadius: '4px',
                              }}
                            >
                              {item.oncelik}
                            </span>
                          )}
                        </div>

                        <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-main)' }}>
                          {item.musteriAdSoyad}
                        </div>

                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {item.markaModel}
                        </div>

                        <div
                          style={{
                            fontSize: '11px',
                            color: 'var(--text-dim)',
                            marginTop: '6px',
                            background: 'var(--bg-subtle)',
                            padding: '4px 6px',
                            borderRadius: 'var(--radius-sm)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.arizaTanimi}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                          <span>{item.atananTeknisyenAd || 'Atanmadı'}</span>
                          <strong style={{ color: item.kalanTutar > 0 ? 'var(--diza-red)' : 'var(--diza-green)' }}>
                            {formatMoney(item.kalanTutar)}
                          </strong>
                        </div>

                        {/* Kart Altı Hızlı Butonlar */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: '8px',
                            paddingTop: '6px',
                            borderTop: '1px solid var(--border-light)',
                          }}
                        >
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              style={{ height: '24px', padding: '0 6px' }}
                              onClick={e => {
                                e.stopPropagation();
                                onOpenPrint(item);
                              }}
                              title="Yazdır"
                            >
                              <Printer size={11} />
                            </button>
                            <button
                              type="button"
                              className="btn btn-whatsapp btn-sm"
                              style={{ height: '24px', padding: '0 6px' }}
                              onClick={e => {
                                e.stopPropagation();
                                const msg = `Sayın ${item.musteriAdSoyad}, ${item.servisNo} takip numaralı ${item.markaModel} servis durumu: '${meta.label}'. — Gördit Bilgisayar`;
                                window.open(buildWhatsAppLink(item.musteriTelefon, msg), '_blank');
                              }}
                              title="WhatsApp"
                            >
                              <MessageCircle size={11} />
                            </button>
                          </div>

                          {nextSt && (
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              style={{ height: '24px', padding: '0 8px', fontSize: '10px' }}
                              onClick={e => {
                                e.stopPropagation();
                                updateServiceStatus(item.id, nextSt);
                              }}
                              title={`${DURUMLAR[nextSt]?.label} aşamasına ilerlet`}
                            >
                              <span>İlerlet</span>
                              <ChevronRight size={12} />
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
