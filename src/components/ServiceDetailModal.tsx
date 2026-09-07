/**
 * Diza Teknik Servis — Gördit Bilgisayar
 * Copyright © 2024-2026 Gördit Bilgisayar — Zafer GÖRGÜN
 * Servis Detay, İşlem, Parça/İşçilik ve Tahsilat Yönetim Modalı
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
} from 'lucide-react';
import { useServices } from '../context/ServiceContext';
import { DURUMLAR } from '../lib/constants';
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
        style={{ maxWidth: '980px', height: '90vh' }}
      >
        {/* Üst Başlık */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="brand-logo-icon" style={{ width: '36px', height: '36px' }}>
              <Wrench size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 800 }}>{service.servisNo}</h3>
                <span className={`badge ${currentMeta.badgeClass}`}>
                  {currentMeta.label}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                {service.markaModel} — {service.musteriAdSoyad}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => onOpenPrint(service)}
            >
              <Printer size={16} /> <span className="hide-mobile">Yazdır</span>
            </button>
            <button
              type="button"
              className="btn btn-whatsapp btn-sm"
              onClick={handleWhatsApp}
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
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', padding: '0 20px', background: 'rgba(15,23,42,0.4)', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-sm"
            style={{
              background: activeTab === 'info' ? 'rgba(255,255,255,0.1)' : 'transparent',
              borderBottom: activeTab === 'info' ? '2px solid var(--accent)' : 'none',
              borderRadius: '6px 6px 0 0',
              color: activeTab === 'info' ? '#fff' : '#94a3b8',
            }}
            onClick={() => setActiveTab('info')}
          >
            Genel Bilgiler
          </button>

          <button
            type="button"
            className="btn btn-sm"
            style={{
              background: activeTab === 'operations' ? 'rgba(255,255,255,0.1)' : 'transparent',
              borderBottom: activeTab === 'operations' ? '2px solid var(--accent)' : 'none',
              borderRadius: '6px 6px 0 0',
              color: activeTab === 'operations' ? '#fff' : '#94a3b8',
            }}
            onClick={() => setActiveTab('operations')}
          >
            Teknik İşlem & Teşhis
          </button>

          <button
            type="button"
            className="btn btn-sm"
            style={{
              background: activeTab === 'finance' ? 'rgba(255,255,255,0.1)' : 'transparent',
              borderBottom: activeTab === 'finance' ? '2px solid var(--accent)' : 'none',
              borderRadius: '6px 6px 0 0',
              color: activeTab === 'finance' ? '#fff' : '#94a3b8',
            }}
            onClick={() => setActiveTab('finance')}
          >
            Yedek Parça, İşçilik & Bakiye ({(service.satirlar || []).length})
          </button>

          {service.kilitDeseni && service.kilitDeseni.length > 0 && (
            <button
              type="button"
              className="btn btn-sm"
              style={{
                background: activeTab === 'pattern' ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderBottom: activeTab === 'pattern' ? '2px solid var(--accent)' : 'none',
                borderRadius: '6px 6px 0 0',
                color: activeTab === 'pattern' ? '#fff' : '#94a3b8',
              }}
              onClick={() => setActiveTab('pattern')}
            >
              Kilit Deseni
            </button>
          )}
        </div>

        {/* Sekme Gövdeleri */}
        <div className="modal-body" style={{ flex: 1, overflowY: 'auto' }}>
          {activeTab === 'info' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Durum Değiştirme Buton Çubuğu */}
              <div style={{ background: 'rgba(15,23,42,0.5)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8', marginBottom: '8px' }}>
                  Servis Durumunu Güncelle:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {(Object.keys(DURUMLAR) as TeknikServisDurumu[]).map(st => (
                    <button
                      key={st}
                      type="button"
                      className={`btn btn-sm ${service.durum === st ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => updateServiceStatus(service.id, st)}
                    >
                      {DURUMLAR[st]?.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Müşteri ve Cihaz */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                <div style={{ background: 'rgba(15,23,42,0.5)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={16} /> Müşteri Bilgileri
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{service.musteriAdSoyad}</div>
                  <div style={{ fontSize: '14px', color: '#38bdf8', marginTop: '4px', fontWeight: 600 }}>{service.musteriTelefon}</div>
                  {service.musteriEmail && <div style={{ fontSize: '13px', color: '#94a3b8' }}>{service.musteriEmail}</div>}
                  {service.musteriAdres && <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>{service.musteriAdres}</div>}
                </div>

                <div style={{ background: 'rgba(15,23,42,0.5)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Smartphone size={16} /> Cihaz & Güvenlik
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{service.markaModel}</div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px' }}>Tür: {service.cihazTipi}</div>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>Seri / IMEI: {service.seriNoImei}</div>
                  {service.cihazSifresi && (
                    <div style={{ fontSize: '13px', color: '#f59e0b', marginTop: '4px', fontWeight: 600 }}>
                      PIN / Şifre: {service.cihazSifresi}
                    </div>
                  )}
                </div>
              </div>

              {/* Aksesuar ve Ekspertiz */}
              <div style={{ background: 'rgba(15,23,42,0.5)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8', marginBottom: '8px' }}>
                  Teslim Alınan Aksesuarlar & Fiziksel Not
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                  {service.aksesuarlar.length === 0 ? (
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Aksesuar teslim alınmadı</span>
                  ) : (
                    service.aksesuarlar.map((a, i) => (
                      <span key={i} className="badge badge-cyan" style={{ fontSize: '11px' }}>
                        {a}
                      </span>
                    ))
                  )}
                </div>
                {service.fizikselDurumNotu && (
                  <div style={{ fontSize: '13px', color: '#f87171', background: 'rgba(239, 68, 68, 0.1)', padding: '8px 12px', borderRadius: '8px' }}>
                    Fiziksel Durum Notu: {service.fizikselDurumNotu}
                  </div>
                )}
              </div>

              {/* Arıza Tanımı */}
              <div style={{ background: 'rgba(15,23,42,0.5)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#f87171', marginBottom: '6px' }}>
                  Müşteri Arıza Bildirimi:
                </div>
                <div style={{ fontSize: '14px', color: '#e2e8f0', background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '8px' }}>
                  {service.arizaTanimi}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'operations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Teknisyen Ön Teşhis & Tespit Notları</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Cihazın test sonuçları, voltaj ölçümleri, arızalı bileşen tespiti..."
                  value={teknisyenTespit}
                  onChange={e => setTeknisyenTespit(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Yapılan İşlemler & Onarım Raporu (Müşteri Fişinde Görünür)</label>
                <textarea
                  className="form-control"
                  rows={5}
                  placeholder="Değiştirilen parçalar, yapılan lehim/BGA işlemleri, uygulanan testler..."
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
                  <Save size={18} /> Teknik Notları Kaydet
                </button>
              </div>
            </div>
          )}

          {activeTab === 'finance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Kalem Ekleme Formu */}
              <form onSubmit={handleAddLine} style={{ background: 'rgba(15,23,42,0.5)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8', marginBottom: '12px' }}>
                  Yeni Yedek Parça veya İşçilik Ekle
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', alignItems: 'flex-end' }}>
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
                        <option value="">-- Stok Parça Seç --</option>
                        {stockParts.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.ad} ({p.stokAdedi} adet) - {formatMoney(p.satisFiyati)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Açıklama / Tanım *</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="Örn: 15.6 LED Ekran veya Anakart Onarımı"
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
                      step="50"
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
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Tür</th>
                      <th>Kalem Tanımı</th>
                      <th>Adet</th>
                      <th>Birim Fiyat</th>
                      <th>Toplam</th>
                      <th>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(service.satirlar || []).length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>
                          Henüz hiçbir parça veya işçilik eklenmemiş.
                        </td>
                      </tr>
                    ) : (
                      service.satirlar.map(row => (
                        <tr key={row.id}>
                          <td>
                            <span className="badge badge-blue" style={{ fontSize: '11px' }}>{row.tur}</span>
                          </td>
                          <td style={{ fontWeight: 600 }}>{row.tanim}</td>
                          <td>{row.adet}</td>
                          <td>{formatMoney(row.birimFiyat)}</td>
                          <td style={{ fontWeight: 700, color: '#fff' }}>{formatMoney(row.toplamTutar)}</td>
                          <td>
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
                <div style={{ width: '320px', background: 'rgba(15,23,42,0.6)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                    <span>Yedek Parça Toplamı:</span>
                    <strong style={{ color: '#fff' }}>{formatMoney(service.parcaUcreti)}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                    <span>İşçilik Ücreti:</span>
                    <strong style={{ color: '#fff' }}>{formatMoney(service.iscilikUcreti)}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                    <span>Hesaplanan KDV (%20):</span>
                    <strong style={{ color: '#fff' }}>{formatMoney(service.kdvTutari)}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8' }}>
                    <span>İndirim Tutarı:</span>
                    <input
                      type="number"
                      min="0"
                      style={{ width: '100px', height: '30px', textAlign: 'right', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#f87171', padding: '0 6px' }}
                      value={indirimTutari}
                      onChange={e => {
                        const val = parseFloat(e.target.value) || 0;
                        setIndirimTutari(val);
                        updateService(service.id, { indirimTutari: val });
                      }}
                    />
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800 }}>
                    <span>Genel Toplam:</span>
                    <strong style={{ color: '#38bdf8' }}>{formatMoney(service.toplamTutar)}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399' }}>
                    <span>Alınan Kapora:</span>
                    <strong>{formatMoney(service.alinanKapora)}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 800, color: service.kalanTutar > 0 ? '#fb7185' : '#34d399' }}>
                    <span>Kalan Bakiye:</span>
                    <strong>{formatMoney(service.kalanTutar)}</strong>
                  </div>

                  {service.kalanTutar > 0 && service.durum !== 'TeslimEdildi' && (
                    <button
                      type="button"
                      className="btn btn-success"
                      style={{ marginTop: '10px' }}
                      onClick={() => {
                        if (confirm(`${formatMoney(service.kalanTutar)} tahsil edilip cihaz 'Teslim Edildi' durumuna alınsın mı?`)) {
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', padding: '30px 0' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#38bdf8' }}>
                Cihaz Ekran Kilit Deseni
              </div>
              <PatternLock
                value={service.kilitDeseni}
                readonly
                size={240}
              />
              <p style={{ color: '#94a3b8', fontSize: '12px' }}>
                Cihaz kabulü anında kaydedilen Android 3x3 kilit deseni.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
