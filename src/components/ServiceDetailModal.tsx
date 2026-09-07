/**
 * Diza Teknik Servis — Gördit Bilgisayar
 * Copyright © 2024-2026 Gördit Bilgisayar — Zafer GÖRGÜN
 * Sade ve Anlaşılır Servis Detay, İşlem, Parça/İşçilik ve Tahsilat Modalı
 */

import React, { useState } from 'react';
import {
  X,
  Printer,
  MessageCircle,
  Plus,
  Trash2,
  Wrench,
  User,
  Smartphone,
  CheckCircle2,
  Save,
  Truck,
  Store,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useServices } from '../context/ServiceContext';
import { DURUMLAR, FAALIYET_ALANLARI } from '../lib/constants';
import { formatMoney, buildWhatsAppLink } from '../lib/format';
import { PatternLock } from './PatternLock';
import type { TeknikServisItem, TeknikServisDurumu } from '../types';

interface ServiceDetailModalProps {
  service: TeknikServisItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenPrint: (service: TeknikServisItem) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  isOpen,
  onClose,
  onOpenPrint,
}) => {
  const {
    updateService,
    updateServiceStatus,
    addServiceLine,
    removeServiceLine,
    stockParts,
  } = useServices();

  const [activeTab, setActiveTab] = useState<'info' | 'operations' | 'finance' | 'pattern'>('info');

  // Yeni Kalem Ekleme Formu
  const [lineTur, setLineTur] = useState<'Parca' | 'Iscilik'>('Parca');
  const [selectedStockId, setSelectedStockId] = useState('');
  const [lineTanim, setLineTanim] = useState('');
  const [lineAdet, setLineAdet] = useState(1);
  const [lineFiyat, setLineFiyat] = useState(0);
  const [lineKdv, setLineKdv] = useState(20);

  // İşlem Düzenlemeleri
  const [teknisyenTespit, setTeknisyenTespit] = useState(service?.teknisyenTespit || '');
  const [yapilanIslemler, setYapilanIslemler] = useState(service?.yapilanIslemler || '');
  const [indirimTutari, setIndirimTutari] = useState(service?.indirimTutari || 0);

  if (!isOpen || !service) return null;

  const currentMeta = DURUMLAR[service.durum] || DURUMLAR.KabulEdildi;

  const handleStockSelect = (stockId: string) => {
    setSelectedStockId(stockId);
    const p = stockParts.find(x => x.id === stockId);
    if (p) {
      setLineTanim(p.ad);
      setLineFiyat(p.satisFiyati);
      setLineKdv(p.kdvOrani);
    }
  };

  const handleAddLine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lineTanim.trim()) return;
    const birim = Number(lineFiyat) || 0;
    const adet = Number(lineAdet) || 1;
    addServiceLine(service.id, {
      tur: lineTur,
      tanim: lineTanim,
      adet,
      birimFiyat: birim,
      kdvOrani: lineKdv,
      toplamTutar: birim * adet,
    });
    setLineTanim('');
    setLineFiyat(0);
    setLineAdet(1);
    setSelectedStockId('');
  };

  const handleSaveNotes = () => {
    updateService(service.id, {
      teknisyenTespit,
      yapilanIslemler,
      indirimTutari: Number(indirimTutari) || 0,
    });
    alert('İşlemler ve teknik notlar başarıyla güncellendi.');
  };

  const handleWhatsApp = () => {
    let msg = '';
    if (service.durum === 'OnayBekliyor') {
      msg = `Sayın ${service.musteriAdSoyad}, ${service.markaModel} cihazınız incelenmiştir. Parça ve işçilik dahil onarım tutarı: ${formatMoney(service.toplamTutar)} TL'dir. Onayınız için geri dönüşünüzü bekliyoruz. — Gördit Bilgisayar`;
    } else if (service.durum === 'Tamamlandi') {
      msg = `Sayın ${service.musteriAdSoyad}, ${service.markaModel} cihazınızın onarımı başarıyla tamamlanmıştır. Servisimizden teslim alabilirsiniz. Kalan bakiye: ${formatMoney(service.kalanTutar)}. — Gördit Bilgisayar`;
    } else {
      msg = `Sayın ${service.musteriAdSoyad}, ${service.servisNo} takip numaralı ${service.markaModel} cihazınız '${currentMeta.label}' durumundadır. — Gördit Bilgisayar`;
    }
    window.open(buildWhatsAppLink(service.musteriTelefon, msg), '_blank');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '920px', height: '88vh' }}
      >
        {/* Üst Başlık */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-logo-box">DİZA</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--diza-navy)' }}>
                  {service.servisNo}
                </h3>
                <span className={`badge ${FAALIYET_ALANLARI[service.faaliyetAlani]?.badge || 'badge-primary'}`}>
                  {FAALIYET_ALANLARI[service.faaliyetAlani]?.label}
                </span>
                <span className={`badge ${currentMeta.badgeClass}`}>
                  {currentMeta.label}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {service.markaModel} — {service.musteriAdSoyad} ({service.musteriTelefon})
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => onOpenPrint(service)}
              title="Yazdır"
            >
              <Printer size={16} /> <span className="hide-mobile">Fiş Yazdır</span>
            </button>
            <button
              type="button"
              className="btn btn-whatsapp btn-sm"
              onClick={handleWhatsApp}
              title="Müşteriye WhatsApp Mesajı Gönder"
            >
              <MessageCircle size={16} /> <span className="hide-mobile">WhatsApp</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-icon"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Sekmeler */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border)',
            padding: '0 16px',
            background: 'var(--bg-subtle)',
            gap: '8px',
          }}
        >
          <button
            type="button"
            className="btn btn-sm"
            style={{
              background: activeTab === 'info' ? 'var(--bg-card)' : 'transparent',
              borderBottom: activeTab === 'info' ? '3px solid var(--diza-red)' : 'none',
              borderRadius: '6px 6px 0 0',
              fontWeight: activeTab === 'info' ? 700 : 500,
              color: activeTab === 'info' ? 'var(--diza-navy)' : 'var(--text-muted)',
            }}
            onClick={() => setActiveTab('info')}
          >
            Genel Bilgiler & Durum
          </button>

          <button
            type="button"
            className="btn btn-sm"
            style={{
              background: activeTab === 'operations' ? 'var(--bg-card)' : 'transparent',
              borderBottom: activeTab === 'operations' ? '3px solid var(--diza-red)' : 'none',
              borderRadius: '6px 6px 0 0',
              fontWeight: activeTab === 'operations' ? 700 : 500,
              color: activeTab === 'operations' ? 'var(--diza-navy)' : 'var(--text-muted)',
            }}
            onClick={() => setActiveTab('operations')}
          >
            Teknik İşlem & Rapor
          </button>

          <button
            type="button"
            className="btn btn-sm"
            style={{
              background: activeTab === 'finance' ? 'var(--bg-card)' : 'transparent',
              borderBottom: activeTab === 'finance' ? '3px solid var(--diza-red)' : 'none',
              borderRadius: '6px 6px 0 0',
              fontWeight: activeTab === 'finance' ? 700 : 500,
              color: activeTab === 'finance' ? 'var(--diza-navy)' : 'var(--text-muted)',
            }}
            onClick={() => setActiveTab('finance')}
          >
            Parça, İşçilik & Bakiye ({(service.satirlar || []).length})
          </button>

          {service.kilitDeseni && service.kilitDeseni.length > 0 && (
            <button
              type="button"
              className="btn btn-sm"
              style={{
                background: activeTab === 'pattern' ? 'var(--bg-card)' : 'transparent',
                borderBottom: activeTab === 'pattern' ? '3px solid var(--diza-red)' : 'none',
                borderRadius: '6px 6px 0 0',
                fontWeight: activeTab === 'pattern' ? 700 : 500,
                color: activeTab === 'pattern' ? 'var(--diza-navy)' : 'var(--text-muted)',
              }}
              onClick={() => setActiveTab('pattern')}
            >
              Kilit Deseni
            </button>
          )}
        </div>

        {/* Sekme Gövdeleri */}
        <div className="modal-body" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {activeTab === 'info' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Durum Değiştirme Buton Çubuğu */}
              <div style={{ background: 'var(--bg-subtle)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--diza-navy)', marginBottom: '8px' }}>
                  Servis Aşamasını Hızlı Güncelle:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(Object.keys(DURUMLAR) as TeknikServisDurumu[]).map(st => {
                    const isCurrent = service.durum === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        className={`btn btn-sm ${isCurrent ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontWeight: isCurrent ? 700 : 500 }}
                        onClick={() => updateServiceStatus(service.id, st)}
                      >
                        {isCurrent && '✓ '}
                        {DURUMLAR[st]?.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dış Servis Saha Detayı */}
              {service.servisTuru === 'DisServis' && (
                <div style={{ background: 'var(--diza-red-light)', border: '1px solid #fecdd3', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--diza-red)', fontSize: '13px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Truck size={16} /> Saha Montaj & Müdahale Bilgileri
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '13px' }}>
                    <div><strong>Saha Adresi:</strong> {service.sahaAdresi || service.musteriAdres || '—'}</div>
                    <div><strong>Randevu Tarihi:</strong> {service.sahaRandevuTarihi || 'Planlanmadı'}</div>
                    <div><strong>Saha Ekibi:</strong> {service.sahaEkibi || service.atananTeknisyenAd || '—'}</div>
                    {service.sahaNotu && <div style={{ gridColumn: 'span 2' }}><strong>Saha Notu:</strong> {service.sahaNotu}</div>}
                  </div>
                </div>
              )}

              {/* Müşteri ve Cihaz */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--diza-navy)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={16} /> Müşteri Bilgileri
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>{service.musteriAdSoyad}</div>
                  <div style={{ fontSize: '13px', color: 'var(--diza-navy)', marginTop: '2px', fontWeight: 600 }}>{service.musteriTelefon}</div>
                  {service.musteriAdres && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{service.musteriAdres}</div>}
                </div>

                <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--diza-navy)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Smartphone size={16} /> Cihaz & Sistem Bilgisi
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>{service.markaModel}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Sektör: {service.cihazTipi}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Seri No: {service.seriNoImei}</div>
                  {service.cihazSifresi && (
                    <div style={{ fontSize: '12px', color: '#d97706', marginTop: '2px', fontWeight: 600 }}>
                      Şifre: {service.cihazSifresi}
                    </div>
                  )}
                </div>
              </div>

              {/* Aksesuarlar */}
              {service.aksesuarlar && service.aksesuarlar.length > 0 && (
                <div style={{ background: 'var(--bg-card)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Teslim Alınan Aksesuarlar
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {service.aksesuarlar.map((a, i) => (
                      <span key={i} className="badge badge-secondary" style={{ fontSize: '11px' }}>
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Arıza Bildirimi */}
              <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--diza-red)', marginBottom: '6px' }}>
                  Arıza / Talep Açıklaması:
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-main)', background: 'var(--bg-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                  {service.arizaTanimi}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'operations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Teknisyen Ön Teşhis & Arıza Tespiti
                </label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Cihazın test sonuçları, voltaj ölçümleri, arızalı bileşen tespiti..."
                  value={teknisyenTespit}
                  onChange={e => setTeknisyenTespit(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Yapılan İşlemler & Onarım Raporu (Müşteri Fişinde Görünür)
                </label>
                <textarea
                  className="form-control"
                  rows={5}
                  placeholder="Değiştirilen parçalar, uygulanan işlemler, montaj veya test detayları..."
                  value={yapilanIslemler}
                  onChange={e => setYapilanIslemler(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveNotes}
                >
                  <Save size={16} />
                  <span>Teknik Notları Kaydet</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'finance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Kalem Ekleme Formu */}
              <form
                onSubmit={handleAddLine}
                style={{
                  background: 'var(--bg-subtle)',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--diza-navy)', marginBottom: '10px' }}>
                  Yeni Yedek Parça veya İşçilik Ekle
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', alignItems: 'flex-end' }}>
                  <div>
                    <label className="form-label">Tür</label>
                    <select
                      className="form-control"
                      value={lineTur}
                      onChange={e => setLineTur(e.target.value as any)}
                    >
                      <option value="Parca">Yedek Parça</option>
                      <option value="Iscilik">İşçilik / Hizmet</option>
                    </select>
                  </div>

                  {lineTur === 'Parca' && (
                    <div>
                      <label className="form-label">Stoktan Seç (Opsiyonel)</label>
                      <select
                        className="form-control"
                        value={selectedStockId}
                        onChange={e => handleStockSelect(e.target.value)}
                      >
                        <option value="">-- Stok Parça --</option>
                        {stockParts.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.ad} ({p.stokAdedi} adet) - {formatMoney(p.satisFiyati)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Açıklama / Kalem Adı *</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="Örn: 2MP Bullet Kamera veya Montaj İşçiliği"
                      value={lineTanim}
                      onChange={e => setLineTanim(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="form-label">Adet</label>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      value={lineAdet}
                      onChange={e => setLineAdet(parseInt(e.target.value) || 1)}
                    />
                  </div>

                  <div>
                    <label className="form-label">Birim Fiyat (TL)</label>
                    <input
                      type="number"
                      min="0"
                      step="25"
                      className="form-control"
                      value={lineFiyat}
                      onChange={e => setLineFiyat(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                      <Plus size={16} /> Ekle
                    </button>
                  </div>
                </div>
              </form>

              {/* Kalemler Tablosu */}
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Tür</th>
                      <th>Kalem Tanımı</th>
                      <th>Adet</th>
                      <th>Birim Fiyat</th>
                      <th>Toplam</th>
                      <th style={{ textAlign: 'right' }}>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(service.satirlar || []).length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '18px' }}>
                          Henüz hiçbir parça veya işçilik eklenmemiş.
                        </td>
                      </tr>
                    ) : (
                      service.satirlar.map(row => (
                        <tr key={row.id}>
                          <td>
                            <span className="badge badge-secondary" style={{ fontSize: '11px' }}>
                              {row.tur}
                            </span>
                          </td>
                          <td style={{ fontWeight: 600 }}>{row.tanim}</td>
                          <td>{row.adet}</td>
                          <td>{formatMoney(row.birimFiyat)}</td>
                          <td>
                            <strong style={{ color: 'var(--diza-navy)' }}>
                              {formatMoney(row.toplamTutar)}
                            </strong>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              style={{ height: '26px', padding: '0 8px' }}
                              onClick={() => removeServiceLine(service.id, row.id)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Maliyet & Bakiye Özeti */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div
                  style={{
                    width: '320px',
                    background: 'var(--bg-card)',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    fontSize: '13px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Yedek Parça:</span>
                    <strong>{formatMoney(service.parcaUcreti)}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>İşçilik:</span>
                    <strong>{formatMoney(service.iscilikUcreti)}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>KDV (%20):</span>
                    <strong>{formatMoney(service.kdvTutari)}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
                    <span>İndirim:</span>
                    <input
                      type="number"
                      min="0"
                      style={{ width: '90px', height: '28px', textAlign: 'right' }}
                      className="form-control"
                      value={indirimTutari}
                      onChange={e => {
                        const val = parseFloat(e.target.value) || 0;
                        setIndirimTutari(val);
                        updateService(service.id, { indirimTutari: val });
                      }}
                    />
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 800 }}>
                    <span>Genel Toplam:</span>
                    <strong style={{ color: 'var(--diza-navy)' }}>{formatMoney(service.toplamTutar)}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--diza-green)' }}>
                    <span>Alınan Kapora:</span>
                    <strong>{formatMoney(service.alinanKapora)}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800, color: service.kalanTutar > 0 ? 'var(--diza-red)' : 'var(--diza-green)' }}>
                    <span>Kalan Bakiye:</span>
                    <strong>{formatMoney(service.kalanTutar)}</strong>
                  </div>

                  {service.kalanTutar > 0 && service.durum !== 'TeslimEdildi' && (
                    <button
                      type="button"
                      className="btn btn-success"
                      style={{ marginTop: '8px' }}
                      onClick={() => {
                        if (confirm(`${formatMoney(service.kalanTutar)} tahsil edilip servis 'Teslim Edildi' durumuna alınsın mı?`)) {
                          updateServiceStatus(service.id, 'TeslimEdildi');
                        }
                      }}
                    >
                      <CheckCircle2 size={16} /> Bakiyeyi Tahsil Et & Teslim Et
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pattern' && service.kilitDeseni && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '24px 0' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--diza-navy)' }}>
                Cihaz Ekran Kilit Deseni
              </div>
              <PatternLock
                value={service.kilitDeseni}
                readonly
                size={220}
              />
              <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                Cihaz kabulü anında kaydedilen Android 3x3 kilit deseni.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
