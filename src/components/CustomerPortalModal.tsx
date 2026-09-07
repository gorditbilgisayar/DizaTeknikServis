/**
 * Diza Teknik Servis — Gördit Bilgisayar
 * Copyright © 2024-2026 Gördit Bilgisayar — Zafer GÖRGÜN
 * Müşteri Canlı Servis Durumu Sorgulama Portalı
 */

import React, { useState } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Phone,
  MapPin,
  HelpCircle,
} from 'lucide-react';
import { useServices } from '../context/ServiceContext';
import { DURUMLAR } from '../lib/constants';
import { formatMoney } from '../lib/format';
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
    const q = query.trim().toLowerCase();
    if (!q) return;

    const found = services.find(
      s =>
        s.servisNo.toLowerCase() === q ||
        s.musteriTelefon.replace(/\D/g, '').includes(q.replace(/\D/g, '')) ||
        s.seriNoImei.toLowerCase() === q
    );

    setSearchedService(found || null);
    setHasSearched(true);
  };

  const steps = [
    { key: 'KabulEdildi', label: 'Cihaz Kabul', desc: 'Servisimize teslim alındı' },
    { key: 'Incelemede', label: 'İnceleme & Teşhis', desc: 'Arıza tespiti yapılıyor' },
    { key: 'OnayBekliyor', label: 'Müşteri Onayı', desc: 'Fiyat onayı bekleniyor' },
    { key: 'Tamirde', label: 'Onarım & Test', desc: 'Donanımsal işlem yapılıyor' },
    { key: 'Tamamlandi', label: 'Teslimata Hazır', desc: 'İşlemler tamamlandı' },
    { key: 'TeslimEdildi', label: 'Teslim Edildi', desc: 'Müşteriye verildi' },
  ];

  const getStepStatus = (stepKey: string, currentDurum: string) => {
    const order = ['KabulEdildi', 'Incelemede', 'OnayBekliyor', 'ParcaBekliyor', 'Tamirde', 'Tamamlandi', 'TeslimEdildi'];
    const curIdx = order.indexOf(currentDurum);
    const stepIdx = order.indexOf(stepKey);
    if (curIdx >= stepIdx) return 'completed';
    return 'pending';
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '780px', height: '85vh' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-logo-icon">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Müşteri Cihaz Sorgulama Portalı</h3>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>{companySettings.resmiUnvan}</p>
            </div>
          </div>

          <button type="button" className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ overflowY: 'auto' }}>
          {/* Arama Kutusu */}
          <div style={{ background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.2) 0%, rgba(15, 23, 42, 0.8) 100%)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '20px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
              Cihazınız Ne Durumda?
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '16px' }}>
              Servis fişinizdeki Servis Numarasını (Örn: TS-2026-0101) veya kayıtlı telefon numaranızı girin.
            </p>

            <form onSubmit={handleSearch} style={{ display: 'flex', maxWidth: '480px', margin: '0 auto', gap: '8px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Örn: TS-2026-0101 veya 0532 412 88 90"
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{ height: '46px', fontSize: '15px' }}
              />
              <button type="submit" className="btn btn-primary" style={{ height: '46px', padding: '0 20px' }}>
                <Search size={18} /> Sorgula
              </button>
            </form>
          </div>

          {/* Sonuç Alanı */}
          {hasSearched && (
            searchedService ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', animation: 'fadeIn 0.25s ease' }}>
                {/* Servis Başlık Kartı */}
                <div className="glass-card" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Takip Numarası</span>
                    <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>{searchedService.servisNo}</h3>
                    <p style={{ fontSize: '14px', color: '#38bdf8', fontWeight: 600 }}>{searchedService.markaModel}</p>
                  </div>

                  <div>
                    <span className={`badge ${DURUMLAR[searchedService.durum]?.badgeClass}`} style={{ fontSize: '13px', padding: '6px 14px' }}>
                      {DURUMLAR[searchedService.durum]?.label}
                    </span>
                  </div>
                </div>

                {/* Süreç Zaman Çizelgesi (Timeline) */}
                <div className="glass-card">
                  <h4 style={{ fontSize: '14px', marginBottom: '16px', color: '#cbd5e1' }}>Servis İlerleme Aşamaları:</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                    {steps.map(step => {
                      const st = getStepStatus(step.key, searchedService.durum);
                      const isDone = st === 'completed';
                      return (
                        <div
                          key={step.key}
                          style={{
                            background: isDone ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                            border: isDone ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
                            borderRadius: '10px',
                            padding: '12px 10px',
                            textAlign: 'center',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
                            {isDone ? <CheckCircle2 size={20} color="#10b981" /> : <Clock size={20} color="#64748b" />}
                          </div>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: isDone ? '#fff' : '#64748b' }}>
                            {step.label}
                          </div>
                          <div style={{ fontSize: '10px', color: isDone ? '#94a3b8' : '#475569', marginTop: '2px' }}>
                            {step.desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Arıza ve Bilgilendirme */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                  <div className="glass-card">
                    <h4 style={{ fontSize: '13px', color: '#f87171', marginBottom: '6px' }}>Bildirilen Şikayet:</h4>
                    <p style={{ fontSize: '13px', color: '#e2e8f0' }}>{searchedService.arizaTanimi}</p>

                    {searchedService.yapilanIslemler && (
                      <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                        <h4 style={{ fontSize: '13px', color: '#34d399', marginBottom: '4px' }}>Servis İşlem Notu:</h4>
                        <p style={{ fontSize: '13px', color: '#e2e8f0' }}>{searchedService.yapilanIslemler}</p>
                      </div>
                    )}
                  </div>

                  <div className="glass-card">
                    <h4 style={{ fontSize: '13px', color: '#38bdf8', marginBottom: '10px' }}>Ödeme & Bakiye Durumu:</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>
                      <span>Toplam Onarım Tutarı:</span>
                      <strong style={{ color: '#fff' }}>{formatMoney(searchedService.toplamTutar)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#34d399', marginBottom: '4px' }}>
                      <span>Ödenen Kapora:</span>
                      <strong>{formatMoney(searchedService.alinanKapora)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 800, borderTop: '1px solid var(--border-color)', paddingTop: '6px', color: searchedService.kalanTutar > 0 ? '#fb7185' : '#34d399' }}>
                      <span>Kalan Ödenecek:</span>
                      <strong>{formatMoney(searchedService.kalanTutar)}</strong>
                    </div>
                  </div>
                </div>

                {/* İletişim Bilgisi */}
                <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#94a3b8' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={16} color="#38bdf8" />
                    <span>{companySettings.adres}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={16} color="#38bdf8" />
                    <span>Müşteri Hizmetleri: {companySettings.telefon} | GSM: {companySettings.gsm}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                <HelpCircle size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                <h4 style={{ fontSize: '16px', color: '#cbd5e1' }}>Kayıt Bulunamadı</h4>
                <p style={{ fontSize: '13px', marginTop: '4px' }}>
                  Girdiğiniz arama kriterine uygun servis kaydı bulunamadı. Lütfen servis numarasını veya telefonunuzu kontrol ediniz.
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
