/**
 * Diza Teknik Servis — Gördit Bilgisayar
 * Copyright © 2024-2026 Gördit Bilgisayar — Zafer GÖRGÜN
 * Müşteri Cihaz Sorgulama Portalı Modalı
 */

import React, { useState } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';
import { useServices } from '../context/ServiceContext';
import { DURUMLAR } from '../lib/constants';
import { formatMoney, formatDateTime } from '../lib/format';
import type { TeknikServisItem } from '../types';

interface CustomerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerPortalModal: React.FC<CustomerPortalModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { services, companySettings } = useServices();
  const [query, setQuery] = useState('');
  const [searchedService, setSearchedService] = useState<TeknikServisItem | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQ = query.trim().toLowerCase();
    if (!cleanQ) return;

    const found = services.find(
      s =>
        s.servisNo.toLowerCase() === cleanQ ||
        s.musteriTelefon.replace(/\D/g, '').includes(cleanQ.replace(/\D/g, ''))
    );

    setSearchedService(found || null);
    setHasSearched(true);
  };

  const steps = [
    { key: 'KabulEdildi', label: 'Cihaz Alındı', desc: 'Atölyeye veya sahaya ulaştı' },
    { key: 'Incelemede', label: 'Arıza Tespiti', desc: 'Teknisyen incelemede' },
    { key: 'OnayBekliyor', label: 'Fiyat Onayı', desc: 'Müşteri onayı bekleniyor' },
    { key: 'Tamirde', label: 'İşlem / Montaj', desc: 'Parça değişimi ve onarım' },
    { key: 'Tamamlandi', label: 'Teslime Hazır', desc: 'Test edildi, hazır' },
  ];

  const getStepStatus = (stepKey: string, currentStatus: string) => {
    const order = ['KabulEdildi', 'Incelemede', 'OnayBekliyor', 'Tamirde', 'ParcaBekliyor', 'Tamamlandi', 'TeslimEdildi'];
    const curIdx = order.indexOf(currentStatus);
    const stepIdx = order.indexOf(stepKey);
    if (curIdx >= stepIdx) return 'completed';
    return 'pending';
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '780px', maxHeight: '90vh' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-logo-box">DİZA</div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--diza-navy)' }}>
                Müşteri Cihaz & Servis Sorgulama Portalı
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{companySettings.resmiUnvan}</p>
            </div>
          </div>

          <button type="button" className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Arama Kutusu */}
          <div
            style={{
              background: 'var(--bg-subtle)',
              padding: '20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              textAlign: 'center',
            }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--diza-navy)', marginBottom: '4px' }}>
              Cihazınız veya Montajınız Ne Durumda?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '14px' }}>
              Servis fişinizdeki Servis Numarasını (Örn: TS-2026-0101) veya kayıtlı telefon numaranızı girin.
            </p>

            <form onSubmit={handleSearch} style={{ display: 'flex', maxWidth: '460px', margin: '0 auto', gap: '8px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Örn: TS-2026-0101 veya 0(541) 608 53 44"
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{ height: '42px', fontSize: '14px' }}
                autoFocus
              />
              <button type="submit" className="btn btn-primary" style={{ height: '42px', padding: '0 18px', fontWeight: 700 }}>
                <Search size={16} /> Sorgula
              </button>
            </form>
          </div>

          {/* Sonuç Alanı */}
          {hasSearched && (
            searchedService ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Servis Başlık Kartı */}
                <div className="glass-card" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', padding: '14px 18px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Takip Fiş Numarası</span>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--diza-navy)' }}>
                      {searchedService.servisNo}
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 600 }}>
                      {searchedService.markaModel}
                    </p>
                  </div>

                  <div>
                    <span className={`badge ${DURUMLAR[searchedService.durum]?.badgeClass}`} style={{ fontSize: '13px', padding: '6px 14px' }}>
                      {DURUMLAR[searchedService.durum]?.label}
                    </span>
                  </div>
                </div>

                {/* Süreç Zaman Çizelgesi (Timeline) */}
                <div className="glass-card" style={{ padding: '14px 18px' }}>
                  <h4 style={{ fontSize: '13px', marginBottom: '12px', color: 'var(--text-muted)' }}>
                    Servis İlerleme Aşamaları:
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
                    {steps.map(step => {
                      const st = getStepStatus(step.key, searchedService.durum);
                      const isDone = st === 'completed';
                      return (
                        <div
                          key={step.key}
                          style={{
                            background: isDone ? 'var(--diza-green-light)' : 'var(--bg-subtle)',
                            border: isDone ? '1px solid var(--diza-green)' : '1px solid var(--border)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '10px 8px',
                            textAlign: 'center',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                            {isDone ? <CheckCircle2 size={18} color="var(--diza-green)" /> : <Clock size={18} color="var(--text-dim)" />}
                          </div>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: isDone ? 'var(--diza-green)' : 'var(--text-muted)' }}>
                            {step.label}
                          </div>
                          <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px' }}>
                            {step.desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Arıza ve Bilgilendirme */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                  <div className="glass-card" style={{ padding: '14px' }}>
                    <h4 style={{ fontSize: '13px', color: 'var(--diza-red)', marginBottom: '4px' }}>Bildirilen Talep / Arıza:</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-main)' }}>{searchedService.arizaTanimi}</p>

                    {searchedService.yapilanIslemler && (
                      <div style={{ marginTop: '10px', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
                        <h4 style={{ fontSize: '13px', color: 'var(--diza-green)', marginBottom: '4px' }}>Servis İşlem Raporu:</h4>
                        <p style={{ fontSize: '13px', color: 'var(--text-main)' }}>{searchedService.yapilanIslemler}</p>
                      </div>
                    )}
                  </div>

                  <div className="glass-card" style={{ padding: '14px' }}>
                    <h4 style={{ fontSize: '13px', color: 'var(--diza-navy)', marginBottom: '8px' }}>Hesap & Bakiye Durumu:</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      <span>Toplam Tutar:</span>
                      <strong style={{ color: 'var(--text-main)' }}>{formatMoney(searchedService.toplamTutar)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--diza-green)', marginBottom: '4px' }}>
                      <span>Ödenen Kapora:</span>
                      <strong>{formatMoney(searchedService.alinanKapora)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 800, borderTop: '1px solid var(--border)', paddingTop: '6px', color: searchedService.kalanTutar > 0 ? 'var(--diza-red)' : 'var(--diza-green)' }}>
                      <span>Kalan Ödenecek:</span>
                      <strong>{formatMoney(searchedService.kalanTutar)}</strong>
                    </div>
                  </div>
                </div>

                {/* İletişim Bilgisi */}
                <div
                  style={{
                    background: 'var(--bg-subtle)',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={15} color="var(--diza-navy)" />
                    <span>{companySettings.adres}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={15} color="var(--diza-navy)" />
                    <span>Tel: {companySettings.telefon} | GSM: {companySettings.gsm}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <HelpCircle size={36} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                <h4 style={{ fontSize: '15px', color: 'var(--text-main)' }}>Kayıt Bulunamadı</h4>
                <p style={{ fontSize: '13px', marginTop: '4px' }}>
                  Girdiğiniz arama kriterine uygun servis kaydı bulunamadı. Lütfen servis fiş numaranızı veya telefonunuzu kontrol ediniz.
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
