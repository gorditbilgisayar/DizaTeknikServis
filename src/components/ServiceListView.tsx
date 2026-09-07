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
  Truck,
  Store,
  MapPin,
  Calendar,
  Wrench,
  Video,
  BellRing,
  Network,
  Flame,
  Code2,
} from 'lucide-react';
import { useServices } from '../context/ServiceContext';
import { DURUMLAR, FAALIYET_ALANLARI, ISLEM_TURLERI } from '../lib/constants';
import { formatMoney, formatDateTime, buildWhatsAppLink } from '../lib/format';
import type { TeknikServisItem, TeknikServisDurumu, ServisTuru, FaaliyetAlani } from '../types';

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
  const [servisTuruFilter, setServisTuruFilter] = useState<string>('ALL');
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

    const matchTuru = servisTuruFilter === 'ALL' ? true : item.servisTuru === servisTuruFilter;
    const matchFaaliyet = faaliyetFilter === 'ALL' ? true : item.faaliyetAlani === faaliyetFilter;

    return matchSearch && matchStatus && matchTuru && matchFaaliyet;
  });

  const selectedItem = services.find(s => s.id === selectedServiceId) || filtered[0];

  const handleWhatsAppNotify = (item: TeknikServisItem, e: React.MouseEvent) => {
    e.stopPropagation();
    let msg = '';
    if (item.islemTuru === 'Teklif') {
      msg = `Sayın ${item.musteriAdSoyad}, talep ettiğiniz ${item.markaModel} projesi için fiyat teklifimiz hazırlanmıştır. Teklif tutarı: ${formatMoney(item.toplamTutar)} TL'dir. — Gördit Bilgisayar`;
    } else if (item.servisTuru === 'DisServis' && item.durum === 'Tamirde') {
      msg = `Sayın ${item.musteriAdSoyad}, ${item.markaModel} saha montaj ve kurulum ekibimiz randevu saatinizde adresinize hareket edecektir. — Gördit Bilgisayar`;
    } else if (item.durum === 'Tamamlandi') {
      msg = `Sayın ${item.musteriAdSoyad}, ${item.markaModel} cihazınızın / sisteminizin işlemleri başarıyla tamamlanmıştır. Kalan bakiye: ${formatMoney(item.kalanTutar)}. — Gördit Bilgisayar`;
    } else {
      msg = `Sayın ${item.musteriAdSoyad}, ${item.servisNo} takip numaralı ${item.markaModel} servis durumu: '${DURUMLAR[item.durum]?.label}'. — Gördit Bilgisayar`;
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

          {/* İç / Dış Servis Filtresi */}
          <select
            className="form-control"
            style={{ width: 'auto', height: '36px', fontSize: '13px', fontWeight: 600 }}
            value={servisTuruFilter}
            onChange={e => setServisTuruFilter(e.target.value)}
          >
            <option value="ALL">Tüm Lokasyonlar (İç & Dış)</option>
            <option value="IcServis">🏠 Yalnızca İç Servis (Atölye)</option>
            <option value="DisServis">🚛 Yalnızca Dış Servis (Saha / Montaj)</option>
          </select>

          {/* Faaliyet Alanı Filtresi */}
          <select
            className="form-control"
            style={{ width: 'auto', height: '36px', fontSize: '13px' }}
            value={faaliyetFilter}
            onChange={e => setFaaliyetFilter(e.target.value)}
          >
            <option value="ALL">Tüm Sektörler / Faaliyetler</option>
            <option value="GuvenlikKamerasi">📹 Güvenlik Kamerası (CCTV)</option>
            <option value="AlarmSistemi">🚨 Hırsız Alarm Sistemi</option>
            <option value="Bilgisayar">💻 Bilgisayar & Donanım & Sunucu</option>
            <option value="Network">🌐 Network & Ağ & Kablolama</option>
            <option value="YanginAlarm">🔥 Yangın Alarm & İhbar</option>
            <option value="Yazilim">💻 Yazılım & Muhasebe & SQL</option>
          </select>

          {/* Durum Filtresi */}
          <select
            className="form-control"
            style={{ width: 'auto', height: '36px', fontSize: '13px' }}
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

        <div style={{ fontSize: '13px', color: '#94a3b8' }}>
          Toplam <strong>{filtered.length}</strong> kayıt listeleniyor
        </div>
      </div>

      {/* Ana Gövde: Tablet / Masaüstü Responsive Split Layout */}
      <div className="tablet-split-layout">
        {/* Sol Liste Paneli */}
        <div className="split-list-panel">
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-color)', fontWeight: 700, fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Servis & Montaj Kayıtları</span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>{filtered.length} Adet</span>
          </div>

          <div style={{ overflowY: 'auto', flex: 1, padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                Kriterlere uygun servis kaydı bulunamadı.
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
                      padding: '14px',
                      borderRadius: '12px',
                      background: isSelected ? 'rgba(227, 6, 19, 0.12)' : 'var(--bg-card)',
                      border: isSelected ? '1px solid var(--logo-red)' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                      position: 'relative',
                    }}
                  >
                    {/* Üst Bilgi Satırı: Servis No, İç/Dış Etiketi, Durum Rozeti */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 800, fontSize: '13px', color: '#fff' }}>
                          {item.servisNo}
                        </span>
                        {/* İç / Dış Servis Rozeti */}
                        <span className={`badge ${isDisServis ? 'badge-dis-servis' : 'badge-ic-servis'}`} style={{ fontSize: '10px', padding: '1px 6px' }}>
                          {isDisServis ? <Truck size={10} /> : <Store size={10} />}
                          {isDisServis ? 'Saha' : 'Atölye'}
                        </span>
                      </div>

                      <span className={`badge ${meta.badgeClass}`} style={{ fontSize: '10px', padding: '2px 7px' }}>
                        {meta.label}
                      </span>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)' }}>
                      {item.musteriAdSoyad}
                    </div>

                    {/* Faaliyet Alanı & Cihaz */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#38bdf8', marginTop: '3px' }}>
                      <span className={`badge ${faalMeta.badge}`} style={{ fontSize: '9px', padding: '1px 5px' }}>
                        {faalMeta.label.split(' ')[0]}
                      </span>
                      <span>{item.markaModel}</span>
                    </div>

                    {/* Dış Servis Saha Adresi Varsa */}
                    {isDisServis && item.sahaAdresi && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#ff6b72', marginTop: '4px' }}>
                        <MapPin size={12} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.sahaAdresi}
                        </span>
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: '#94a3b8' }}>
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
                        title="WhatsApp Bildir"
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

        {/* Sağ Detay Paneli */}
        <div className="split-detail-panel">
          {selectedItem ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Başlık ve Rozetler */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 800 }}>{selectedItem.servisNo}</h2>
                    <span className={`badge ${selectedItem.servisTuru === 'DisServis' ? 'badge-dis-servis' : 'badge-ic-servis'}`}>
                      {selectedItem.servisTuru === 'DisServis' ? 'Dış Servis / Saha' : 'İç Servis / Atölye'}
                    </span>
                    <span className={`badge ${DURUMLAR[selectedItem.durum]?.badgeClass}`}>
                      {DURUMLAR[selectedItem.durum]?.label}
                    </span>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '3px' }}>
                    Faaliyet: {FAALIYET_ALANLARI[selectedItem.faaliyetAlani]?.label} | İşlem: {ISLEM_TURLERI[selectedItem.islemTuru]?.label}
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

              {/* Dış Servis Saha Kartı (Varsa) */}
              {selectedItem.servisTuru === 'DisServis' && (
                <div style={{ background: 'rgba(227, 6, 19, 0.12)', border: '1px solid rgba(227, 6, 19, 0.35)', borderRadius: '12px', padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff6b72', fontWeight: 700, fontSize: '13px', marginBottom: '8px' }}>
                    <Truck size={16} /> Saha Montaj & Keşif Bilgileri
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '12px' }}>
                    <div>
                      <strong style={{ color: '#cbd5e1' }}>Saha Adresi:</strong>
                      <div style={{ color: '#fff' }}>{selectedItem.sahaAdresi || selectedItem.musteriAdres || 'Belirtilmedi'}</div>
                    </div>
                    <div>
                      <strong style={{ color: '#cbd5e1' }}>Randevu Zamanı:</strong>
                      <div style={{ color: '#fff' }}>{formatDateTime(selectedItem.sahaRandevuTarihi) || 'Planlanmadı'}</div>
                    </div>
                    <div>
                      <strong style={{ color: '#cbd5e1' }}>Saha Ekibi:</strong>
                      <div style={{ color: '#fff' }}>{selectedItem.sahaEkibi || selectedItem.atananTeknisyenAd || 'Atanmadı'}</div>
                    </div>
                    {selectedItem.sahaNotu && (
                      <div style={{ gridColumn: 'span 2' }}>
                        <strong style={{ color: '#cbd5e1' }}>Saha Notu:</strong>
                        <div style={{ color: '#ff6b72' }}>{selectedItem.sahaNotu}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Müşteri & Cihaz Bilgi Kartı */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', marginBottom: '6px', fontWeight: 700, fontSize: '13px' }}>
                    <User size={16} /> Müşteri / Firma
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>{selectedItem.musteriAdSoyad}</div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '2px' }}>Tel: {selectedItem.musteriTelefon}</div>
                  {selectedItem.musteriEmail && <div style={{ fontSize: '12px', color: '#94a3b8' }}>{selectedItem.musteriEmail}</div>}
                  {selectedItem.musteriAdres && <div style={{ fontSize: '12px', color: '#94a3b8' }}>{selectedItem.musteriAdres}</div>}
                </div>

                <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', marginBottom: '6px', fontWeight: 700, fontSize: '13px' }}>
                    <Smartphone size={16} /> Sistem / Donanım
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>{selectedItem.markaModel}</div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '2px' }}>Tür: {selectedItem.cihazTipi}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Seri/IMEI/Mac: {selectedItem.seriNoImei}</div>
                  {selectedItem.cihazSifresi && <div style={{ fontSize: '12px', color: '#f59e0b' }}>Şifre / Port: {selectedItem.cihazSifresi}</div>}
                </div>
              </div>

              {/* Şikayet ve Yapılan İşlemler */}
              <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#ff6b72', marginBottom: '4px' }}>
                  Arıza / Montaj / Teklif Talebi:
                </div>
                <div style={{ fontSize: '13px', color: '#e2e8f0', background: 'rgba(0,0,0,0.2)', padding: '8px 12px', borderRadius: '8px' }}>
                  {selectedItem.arizaTanimi}
                </div>

                {selectedItem.yapilanIslemler && (
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#34d399', marginBottom: '4px' }}>
                      Yapılan İşlemler & Saha Raporu:
                    </div>
                    <div style={{ fontSize: '13px', color: '#e2e8f0', background: 'rgba(0,0,0,0.2)', padding: '8px 12px', borderRadius: '8px' }}>
                      {selectedItem.yapilanIslemler}
                    </div>
                  </div>
                )}
              </div>

              {/* Finansal Kalemler & Bakiye */}
              <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#38bdf8', marginBottom: '8px' }}>
                  Montaj & Parça & İşçilik Kalemleri
                </div>

                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Tür</th>
                        <th>Kalem Açıklaması</th>
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

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                      <span>Toplam Tutar:</span>
                      <strong style={{ color: '#fff' }}>{formatMoney(selectedItem.toplamTutar)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                      <span>Alınan Kapora:</span>
                      <strong style={{ color: '#34d399' }}>{formatMoney(selectedItem.alinanKapora)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', borderTop: '1px solid var(--border-color)', paddingTop: '4px' }}>
                      <span style={{ fontWeight: 700 }}>Kalan Bakiye:</span>
                      <strong style={{ color: selectedItem.kalanTutar > 0 ? '#fb7185' : '#34d399' }}>
                        {formatMoney(selectedItem.kalanTutar)}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hızlı Durum Değiştirme */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700 }}>Durum:</span>
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
              İncelemek için sol taraftan bir kayıt seçin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
