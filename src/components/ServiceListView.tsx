/**
 * Diza Teknik Servis — Gördit Bilgisayar
 * Copyright © 2024-2026 Gördit Bilgisayar — Zafer GÖRGÜN
 * Mobil & Tablet Uyumlu Servis Listesi ve Tablet Split View
 */

import React, { useState } from 'react';
import {
  Filter,
  Printer,
  MessageCircle,
  ChevronRight,
  User,
  Smartphone,
} from 'lucide-react';
import { useServices } from '../context/ServiceContext';
import { DURUMLAR } from '../lib/constants';
import { formatMoney, formatDateTime, buildWhatsAppLink } from '../lib/format';
import type { TeknikServisItem, TeknikServisDurumu } from '../types';

interface ServiceListViewProps {
  searchQuery: string;
  onSelectService: (service: TeknikServisItem) => void;
  onOpenPrint: (service: TeknikServisItem) => void;
  selectedServiceId?: string;
}

export const ServiceListView: React.FC<ServiceListViewProps> = ({
  searchQuery,
  onSelectService,
  onOpenPrint,
  selectedServiceId,
}) => {
  const { services, updateServiceStatus } = useServices();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [deviceFilter, setDeviceFilter] = useState<string>('ALL');

  // Filtreleme
  const filtered = services.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      item.servisNo.toLowerCase().includes(q) ||
      item.musteriAdSoyad.toLowerCase().includes(q) ||
      item.musteriTelefon.includes(q) ||
      item.markaModel.toLowerCase().includes(q) ||
      item.seriNoImei.toLowerCase().includes(q) ||
      (item.atananTeknisyenAd && item.atananTeknisyenAd.toLowerCase().includes(q));

    const matchStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'ACTIVE'
        ? !['TeslimEdildi', 'IptalIade'].includes(item.durum)
        : item.durum === statusFilter;

    const matchDevice = deviceFilter === 'ALL' ? true : item.cihazTipi.includes(deviceFilter);

    return matchSearch && matchStatus && matchDevice;
  });

  const selectedItem = services.find(s => s.id === selectedServiceId) || filtered[0];

  const handleWhatsAppNotify = (item: TeknikServisItem, e: React.MouseEvent) => {
    e.stopPropagation();
    let msg = '';
    if (item.durum === 'KabulEdildi') {
      msg = `Sayın ${item.musteriAdSoyad}, ${item.markaModel} cihazınız ${item.servisNo} takip numarası ile servisimize kabul edilmiştir. Cihazınızı sorgulamak için servis numaranızı kullanabilirsiniz. — Gördit Bilgisayar`;
    } else if (item.durum === 'OnayBekliyor') {
      msg = `Sayın ${item.musteriAdSoyad}, ${item.markaModel} cihazınızın teknik incelemesi tamamlanmıştır. Toplam onarım tutarı: ${formatMoney(item.toplamTutar)} TL'dir. İşleme devam etmek için onayınızı rica ederiz. — Gördit Bilgisayar`;
    } else if (item.durum === 'Tamamlandi') {
      msg = `Sayın ${item.musteriAdSoyad}, ${item.markaModel} cihazınızın onarımı başarıyla tamamlanmıştır. Servisimizden teslim alabilirsiniz. Kalan bakiye: ${formatMoney(item.kalanTutar)}. — Gördit Bilgisayar`;
    } else {
      msg = `Sayın ${item.musteriAdSoyad}, ${item.servisNo} nolu ${item.markaModel} cihazınızın güncel servis durumu: ${DURUMLAR[item.durum]?.label}. — Gördit Bilgisayar`;
    }
    window.open(buildWhatsAppLink(item.musteriTelefon, msg), '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Filtre Çubuğu */}
      <div
        className="glass-card"
        style={{
          padding: '14px 18px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '13px' }}>
            <Filter size={16} />
            <span>Filtre:</span>
          </div>

          <select
            className="form-control"
            style={{ width: 'auto', height: '36px', fontSize: '13px' }}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Tüm Durumlar ({services.length})</option>
            <option value="ACTIVE">Yalnızca Aktif Cihazlar</option>
            {Object.entries(DURUMLAR).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.label} ({services.filter(s => s.durum === key).length})
              </option>
            ))}
          </select>

          <select
            className="form-control"
            style={{ width: 'auto', height: '36px', fontSize: '13px' }}
            value={deviceFilter}
            onChange={e => setDeviceFilter(e.target.value)}
          >
            <option value="ALL">Tüm Cihaz Tipleri</option>
            <option value="Laptop">Laptop / Dizüstü</option>
            <option value="Bilgisayar">Masaüstü PC</option>
            <option value="Telefon">Telefon</option>
            <option value="Tablet">Tablet</option>
            <option value="Yazıcı">Yazıcı / Tarayıcı</option>
          </select>
        </div>

        <div style={{ fontSize: '13px', color: '#94a3b8' }}>
          Toplam <strong>{filtered.length}</strong> kayıt listeleniyor
        </div>
      </div>

      {/* Ana Gövde: Tablet / Masaüstü Responsive Split Layout */}
      <div className="tablet-split-layout">
        {/* Sol Liste Paneli */}
        <div className="split-list-panel">
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-color)', fontWeight: 700, fontSize: '14px' }}>
            Servis Kayıtları
          </div>

          <div style={{ overflowY: 'auto', flex: 1, padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                Kriterlere uygun servis kaydı bulunamadı.
              </div>
            ) : (
              filtered.map(item => {
                const meta = DURUMLAR[item.durum] || DURUMLAR.KabulEdildi;
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectService(item)}
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      background: isSelected ? 'rgba(2, 132, 199, 0.18)' : 'var(--bg-card)',
                      border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 800, fontSize: '13px', color: '#fff' }}>
                        {item.servisNo}
                      </span>
                      <span className={`badge ${meta.badgeClass}`} style={{ fontSize: '11px', padding: '2px 8px' }}>
                        {meta.label}
                      </span>
                    </div>

                    <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>
                      {item.musteriAdSoyad}
                    </div>

                    <div style={{ fontSize: '12px', color: '#38bdf8', marginTop: '2px' }}>
                      {item.markaModel}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', fontSize: '12px', color: '#94a3b8' }}>
                      <span>{item.musteriTelefon}</span>
                      <strong style={{ color: item.kalanTutar > 0 ? '#fb7185' : '#34d399' }}>
                        {item.kalanTutar > 0 ? `Kalan: ${formatMoney(item.kalanTutar)}` : 'Ödendi'}
                      </strong>
                    </div>

                    {/* Hızlı Butonlar */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '6px',
                        marginTop: '10px',
                        paddingTop: '8px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                      }}
                    >
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ height: '28px', padding: '0 8px' }}
                        onClick={e => {
                          e.stopPropagation();
                          onOpenPrint(item);
                        }}
                        title="Yazdır (A4 / Termal / Etiket)"
                      >
                        <Printer size={13} />
                      </button>

                      <button
                        type="button"
                        className="btn btn-whatsapp btn-sm"
                        style={{ height: '28px', padding: '0 8px' }}
                        onClick={e => handleWhatsAppNotify(item, e)}
                        title="WhatsApp ile Müşteriye Bildir"
                      >
                        <MessageCircle size={13} />
                      </button>

                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ height: '28px', padding: '0 10px' }}
                        onClick={() => onSelectService(item)}
                      >
                        Detay <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Sağ Detay Paneli (Tablet ve Masaüstünde Geniş Detay İnceleme) */}
        <div className="split-detail-panel">
          {selectedItem ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Başlık ve Durum */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 800 }}>{selectedItem.servisNo}</h2>
                    <span className={`badge ${DURUMLAR[selectedItem.durum]?.badgeClass}`}>
                      {DURUMLAR[selectedItem.durum]?.label}
                    </span>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '2px' }}>
                    Geliş Tarihi: {formatDateTime(selectedItem.gelisTarihi)}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => onOpenPrint(selectedItem)}
                  >
                    <Printer size={16} />
                    <span>Yazdır</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-whatsapp btn-sm"
                    onClick={e => handleWhatsAppNotify(selectedItem, e)}
                  >
                    <MessageCircle size={16} />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Müşteri & Cihaz Bilgi Kartı */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', marginBottom: '8px', fontWeight: 700, fontSize: '13px' }}>
                    <User size={16} />
                    Müşteri Bilgileri
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>{selectedItem.musteriAdSoyad}</div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px' }}>Tel: {selectedItem.musteriTelefon}</div>
                  {selectedItem.musteriEmail && <div style={{ fontSize: '12px', color: '#94a3b8' }}>{selectedItem.musteriEmail}</div>}
                  {selectedItem.musteriAdres && <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{selectedItem.musteriAdres}</div>}
                </div>

                <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', marginBottom: '8px', fontWeight: 700, fontSize: '13px' }}>
                    <Smartphone size={16} />
                    Cihaz Bilgileri
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>{selectedItem.markaModel}</div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px' }}>Tip: {selectedItem.cihazTipi}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Seri/IMEI: {selectedItem.seriNoImei}</div>
                  {selectedItem.cihazSifresi && <div style={{ fontSize: '12px', color: '#f59e0b' }}>PIN/Şifre: {selectedItem.cihazSifresi}</div>}
                </div>
              </div>

              {/* Şikayet ve Yapılan İşlemler */}
              <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#f87171', marginBottom: '6px' }}>
                  Arıza & Şikayet Tanımı:
                </div>
                <div style={{ fontSize: '14px', color: '#e2e8f0', background: 'rgba(0,0,0,0.2)', padding: '10px 12px', borderRadius: '8px' }}>
                  {selectedItem.arizaTanimi}
                </div>

                {selectedItem.yapilanIslemler && (
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#34d399', marginBottom: '6px' }}>
                      Teknisyen İnceleme & Yapılan İşlemler:
                    </div>
                    <div style={{ fontSize: '14px', color: '#e2e8f0', background: 'rgba(0,0,0,0.2)', padding: '10px 12px', borderRadius: '8px' }}>
                      {selectedItem.yapilanIslemler}
                    </div>
                  </div>
                )}
              </div>

              {/* Finansal Kalemler & Bakiye */}
              <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#38bdf8', marginBottom: '10px' }}>
                  Servis İşçilik & Yedek Parça Kalemleri
                </div>

                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Tür</th>
                        <th>Açıklama</th>
                        <th>Adet</th>
                        <th>Birim</th>
                        <th>Toplam</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedItem.satirlar || []).length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', color: '#64748b' }}>
                            Henüz işlem veya parça kalemi eklenmemiş.
                          </td>
                        </tr>
                      ) : (
                        selectedItem.satirlar.map(row => (
                          <tr key={row.id}>
                            <td>
                              <span className="badge badge-blue" style={{ fontSize: '10px' }}>{row.tur}</span>
                            </td>
                            <td>{row.tanim}</td>
                            <td>{row.adet}</td>
                            <td>{formatMoney(row.birimFiyat)}</td>
                            <td style={{ fontWeight: 700 }}>{formatMoney(row.toplamTutar)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
                  <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                      <span>Genel Toplam:</span>
                      <strong style={{ color: '#fff' }}>{formatMoney(selectedItem.toplamTutar)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                      <span>Alınan Kapora:</span>
                      <strong style={{ color: '#34d399' }}>{formatMoney(selectedItem.alinanKapora)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', borderTop: '1px solid var(--border-color)', paddingTop: '6px' }}>
                      <span style={{ fontWeight: 700 }}>Kalan Bakiye:</span>
                      <strong style={{ color: selectedItem.kalanTutar > 0 ? '#fb7185' : '#34d399' }}>
                        {formatMoney(selectedItem.kalanTutar)}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hızlı Durum İlerletme Çubuğu */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Durum Değiştir:</span>
                {(['Incelemede', 'OnayBekliyor', 'Tamirde', 'Tamamlandi', 'TeslimEdildi'] as TeknikServisDurumu[]).map(st => (
                  <button
                    key={st}
                    type="button"
                    className={`btn btn-sm ${selectedItem.durum === st ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => updateServiceStatus(selectedItem.id, st)}
                  >
                    {DURUMLAR[st]?.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              İncelemek için sol taraftan bir servis seçin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
