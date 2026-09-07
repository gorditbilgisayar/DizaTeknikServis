/**
 * Diza Teknik Servis — Gördit Bilgisayar
 * Copyright © 2024-2026 Gördit Bilgisayar — Zafer GÖRGÜN
 * Sade, Kolay ve Okunaklı Servis Listesi & Bölünmüş Önizleme
 */

import React, { useState } from 'react';
import {
  Filter,
  Printer,
  MessageCircle,
  ChevronRight,
  User,
  Smartphone,
  Truck,
  Store,
  MapPin,
  Calendar,
  Wrench,
} from 'lucide-react';
import { useServices } from '../context/ServiceContext';
import { DURUMLAR, FAALIYET_ALANLARI, ISLEM_TURLERI } from '../lib/constants';
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
  const [faaliyetFilter, setFaaliyetFilter] = useState<string>('ALL');

  // Filtreleme
  const filtered = services.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      item.servisNo.toLowerCase().includes(q) ||
      item.musteriAdSoyad.toLowerCase().includes(q) ||
      item.musteriTelefon.includes(q) ||
      item.markaModel.toLowerCase().includes(q) ||
      item.seriNoImei.toLowerCase().includes(q) ||
      (item.sahaAdresi && item.sahaAdresi.toLowerCase().includes(q)) ||
      (item.atananTeknisyenAd && item.atananTeknisyenAd.toLowerCase().includes(q));

    const matchStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'ACTIVE'
        ? !['TeslimEdildi', 'IptalIade'].includes(item.durum)
        : item.durum === statusFilter;

    const matchFaaliyet = faaliyetFilter === 'ALL' ? true : item.faaliyetAlani === faaliyetFilter;

    return matchSearch && matchStatus && matchFaaliyet;
  });

  const selectedItem = services.find(s => s.id === selectedServiceId) || filtered[0];

  const handleWhatsAppNotify = (item: TeknikServisItem, e: React.MouseEvent) => {
    e.stopPropagation();
    let msg = '';
    if (item.islemTuru === 'Teklif') {
      msg = `Sayın ${item.musteriAdSoyad}, ${item.markaModel} için fiyat teklifimiz hazırlanmıştır. Toplam: ${formatMoney(item.toplamTutar)} TL. — Gördit Bilgisayar`;
    } else if (item.servisTuru === 'DisServis' && item.durum === 'Tamirde') {
      msg = `Sayın ${item.musteriAdSoyad}, ${item.markaModel} montaj ekibimiz randevu saatinizde adresinize gelecektir. — Gördit Bilgisayar`;
    } else if (item.durum === 'Tamamlandi') {
      msg = `Sayın ${item.musteriAdSoyad}, ${item.markaModel} işlemleri tamamlanmıştır. Kalan bakiye: ${formatMoney(item.kalanTutar)}. — Gördit Bilgisayar`;
    } else {
      msg = `Sayın ${item.musteriAdSoyad}, ${item.servisNo} takip numaralı ${item.markaModel} servis durumu: '${DURUMLAR[item.durum]?.label}'. — Gördit Bilgisayar`;
    }
    window.open(buildWhatsAppLink(item.musteriTelefon, msg), '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Sade Filtre Çubuğu */}
      <div
        className="glass-card"
        style={{
          padding: '12px 16px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>
            <Filter size={16} />
            <span>Filtre:</span>
          </div>

          {/* Servis Türü / Faaliyet Alanı Filtresi */}
          <select
            className="form-control"
            style={{ width: 'auto', height: '34px', fontSize: '13px', fontWeight: 600 }}
            value={faaliyetFilter}
            onChange={e => setFaaliyetFilter(e.target.value)}
          >
            <option value="ALL">Tüm Servis Türleri</option>
            <option value="GuvenlikKamerasi">📹 Güvenlik Kamerası (CCTV)</option>
            <option value="AlarmSistemi">🚨 Hırsız Alarm Sistemi</option>
            <option value="Bilgisayar">💻 Bilgisayar & Laptop & Server</option>
            <option value="Network">🌐 Network & Yapısal Kablolama</option>
            <option value="YanginAlarm">🔥 Yangın Alarmı</option>
            <option value="Yazilim">💻 Yazılım & Muhasebe (Diza ERP)</option>
            <option value="Diger">📦 Diğer Teknik Servisler</option>
          </select>

          {/* Durum Filtresi */}
          <select
            className="form-control"
            style={{ width: 'auto', height: '34px', fontSize: '13px' }}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Tüm Durumlar ({services.length})</option>
            <option value="ACTIVE">Yalnızca Devam Edenler</option>
            {Object.entries(DURUMLAR).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.label} ({services.filter(s => s.durum === key).length})
              </option>
            ))}
          </select>
        </div>

        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Toplam <strong>{filtered.length}</strong> kayıt listeleniyor
        </div>
      </div>

      {/* Ana Gövde: Tablet / Masaüstü Responsive Split Layout */}
      <div className="tablet-split-layout">
        {/* Sol Liste Paneli */}
        <div className="split-list-panel">
          <div
            style={{
              padding: '12px 14px',
              borderBottom: '1px solid var(--border)',
              fontWeight: 700,
              fontSize: '13px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--bg-subtle)',
            }}
          >
            <span>Kayıtlar</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{filtered.length} Adet</span>
          </div>

          <div style={{ overflowY: 'auto', flex: 1, padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                Kriterlere uygun kayıt bulunamadı.
              </div>
            ) : (
              filtered.map(item => {
                const meta = DURUMLAR[item.durum] || DURUMLAR.KabulEdildi;
                const faalMeta = FAALIYET_ALANLARI[item.faaliyetAlani] || FAALIYET_ALANLARI.Bilgisayar;
                const isSelected = selectedItem?.id === item.id;
                const isDisServis = item.servisTuru === 'DisServis';

                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectService(item)}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'var(--diza-red-light)' : 'var(--bg-card)',
                      border: isSelected ? '1px solid var(--diza-red)' : '1px solid var(--border)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {/* Üst Bilgi: Servis No, Servis Türü, Durum */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 800, fontSize: '13px', color: 'var(--diza-navy)' }}>
                          {item.servisNo}
                        </span>
                        <span className={`badge ${faalMeta.badge || 'badge-primary'}`} style={{ fontSize: '10px', padding: '1px 5px' }}>
                          {faalMeta.label.split(' ')[0]}
                        </span>
                      </div>

                      <span className={`badge ${meta.badgeClass}`} style={{ fontSize: '10px' }}>
                        {meta.label}
                      </span>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)' }}>
                      {item.musteriAdSoyad}
                    </div>

                    {/* Model & Faaliyet */}
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--diza-navy)' }}>{faalMeta.label.split(' ')[0]}</span> — {item.markaModel}
                    </div>

                    {/* Saha Adresi */}
                    {isDisServis && item.sahaAdresi && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--diza-red)', marginTop: '3px' }}>
                        <MapPin size={12} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.sahaAdresi}
                        </span>
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <span>{item.musteriTelefon}</span>
                      <strong style={{ color: item.kalanTutar > 0 ? 'var(--diza-red)' : 'var(--diza-green)' }}>
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
                        marginTop: '8px',
                        paddingTop: '6px',
                        borderTop: '1px solid var(--border-light)',
                      }}
                    >
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ height: '26px', padding: '0 8px' }}
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
                        style={{ height: '26px', padding: '0 8px' }}
                        onClick={e => handleWhatsAppNotify(item, e)}
                        title="WhatsApp"
                      >
                        <MessageCircle size={12} />
                      </button>

                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ height: '26px', padding: '0 8px', fontSize: '11px' }}
                        onClick={() => onSelectService(item)}
                      >
                        İncele <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Sağ Önizleme Paneli */}
        <div className="split-detail-panel">
          {selectedItem ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Başlık ve Butonlar */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--diza-navy)' }}>
                      {selectedItem.servisNo}
                    </h2>
                    <span className={`badge ${FAALIYET_ALANLARI[selectedItem.faaliyetAlani]?.badge || 'badge-primary'}`}>
                      {FAALIYET_ALANLARI[selectedItem.faaliyetAlani]?.label}
                    </span>
                    <span className={`badge ${DURUMLAR[selectedItem.durum]?.badgeClass}`}>
                      {DURUMLAR[selectedItem.durum]?.label}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>
                    {FAALIYET_ALANLARI[selectedItem.faaliyetAlani]?.label} — {ISLEM_TURLERI[selectedItem.islemTuru]?.label}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => onOpenPrint(selectedItem)}
                  >
                    <Printer size={15} />
                    <span>Fiş Yazdır</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-whatsapp btn-sm"
                    onClick={e => handleWhatsAppNotify(selectedItem, e)}
                  >
                    <MessageCircle size={15} />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => onSelectService(selectedItem)}
                  >
                    <span>Tam Detayı Aç</span>
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>

              {/* Dış Servis Saha Kartı */}
              {selectedItem.servisTuru === 'DisServis' && (
                <div style={{ background: 'var(--diza-red-light)', border: '1px solid #fecdd3', borderRadius: 'var(--radius-md)', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--diza-red)', fontWeight: 700, fontSize: '13px', marginBottom: '6px' }}>
                    <Truck size={15} /> Saha Montaj & Keşif Bilgileri
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', fontSize: '12px' }}>
                    <div>
                      <strong>Saha Adresi:</strong>
                      <div>{selectedItem.sahaAdresi || selectedItem.musteriAdres || 'Belirtilmedi'}</div>
                    </div>
                    <div>
                      <strong>Randevu Tarihi:</strong>
                      <div>{selectedItem.sahaRandevuTarihi || 'Planlanmadı'}</div>
                    </div>
                    <div>
                      <strong>Saha Ekibi:</strong>
                      <div>{selectedItem.sahaEkibi || selectedItem.atananTeknisyenAd || 'Atanmadı'}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Müşteri & Cihaz Bilgi Kartı */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--diza-navy)', marginBottom: '4px', fontWeight: 700, fontSize: '12px' }}>
                    <User size={15} /> Müşteri / Firma
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>{selectedItem.musteriAdSoyad}</div>
                  <div style={{ fontSize: '13px', color: 'var(--diza-navy)', marginTop: '2px', fontWeight: 600 }}>{selectedItem.musteriTelefon}</div>
                  {selectedItem.musteriAdres && <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{selectedItem.musteriAdres}</div>}
                </div>

                <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--diza-navy)', marginBottom: '4px', fontWeight: 700, fontSize: '12px' }}>
                    <Smartphone size={15} /> Sistem / Donanım
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>{selectedItem.markaModel}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Sektör: {selectedItem.cihazTipi}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Seri No: {selectedItem.seriNoImei}</div>
                  {selectedItem.cihazSifresi && <div style={{ fontSize: '11px', color: '#d97706', fontWeight: 600 }}>Şifre: {selectedItem.cihazSifresi}</div>}
                </div>
              </div>

              {/* Talep / Arıza Açıklaması */}
              <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 700, fontSize: '12px', color: 'var(--diza-red)', marginBottom: '4px' }}>
                  Arıza / Montaj / Teklif Talebi:
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-main)', background: 'var(--bg-subtle)', padding: '8px 10px', borderRadius: 'var(--radius-sm)' }}>
                  {selectedItem.arizaTanimi}
                </div>

                {selectedItem.yapilanIslemler && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ fontWeight: 700, fontSize: '12px', color: 'var(--diza-green)', marginBottom: '4px' }}>
                      Yapılan İşlemler:
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-main)', background: 'var(--bg-subtle)', padding: '8px 10px', borderRadius: 'var(--radius-sm)' }}>
                      {selectedItem.yapilanIslemler}
                    </div>
                  </div>
                )}
              </div>

              {/* Kalemler Tablosu */}
              <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 700, fontSize: '12px', color: 'var(--diza-navy)', marginBottom: '6px' }}>
                  İşlem & Parça Kalemleri
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Tür</th>
                        <th>Açıklama</th>
                        <th>Adet</th>
                        <th>Birim Fiyat</th>
                        <th>Toplam</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedItem.satirlar || []).length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '12px' }}>
                            Henüz işlem veya parça kalemi eklenmemiş.
                          </td>
                        </tr>
                      ) : (
                        selectedItem.satirlar.map(row => (
                          <tr key={row.id}>
                            <td>
                              <span className="badge badge-secondary" style={{ fontSize: '10px' }}>{row.tur}</span>
                            </td>
                            <td>{row.tanim}</td>
                            <td>{row.adet}</td>
                            <td>{formatMoney(row.birimFiyat)}</td>
                            <td><strong>{formatMoney(row.toplamTutar)}</strong></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Toplam ve Bakiye */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                      <span>Toplam Tutar:</span>
                      <strong style={{ color: 'var(--diza-navy)' }}>{formatMoney(selectedItem.toplamTutar)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--diza-green)' }}>
                      <span>Alınan Kapora:</span>
                      <strong>{formatMoney(selectedItem.alinanKapora)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderTop: '1px solid var(--border)', paddingTop: '4px' }}>
                      <span style={{ fontWeight: 700 }}>Kalan Bakiye:</span>
                      <strong style={{ color: selectedItem.kalanTutar > 0 ? 'var(--diza-red)' : 'var(--diza-green)' }}>
                        {formatMoney(selectedItem.kalanTutar)}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hızlı Aşama Değiştirme */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>Aşama:</span>
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
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              İncelemek için sol taraftan bir kayıt seçin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
