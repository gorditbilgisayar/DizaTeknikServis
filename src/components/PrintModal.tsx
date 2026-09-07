/**
 * Diza Teknik Servis — Gördit Bilgisayar
 * Copyright © 2024-2026 Gördit Bilgisayar — Zafer GÖRGÜN
 * Yazdırma Modalı: A4 Kurumsal Servis Formu, 80mm Termal Fiş ve Cihaz Barkod Etiketi
 */

import React, { useState } from 'react';
import { X, Printer, FileText, Receipt, Tag } from 'lucide-react';
import { useServices } from '../context/ServiceContext';
import {
  formatMoney,
  formatDateTime,
  generateBarcodeSvg,
  generateQrCodeSvg,
} from '../lib/format';
import { DURUMLAR } from '../lib/constants';
import type { TeknikServisItem } from '../types';

interface PrintModalProps {
  service: TeknikServisItem | null;
  isOpen: boolean;
  onClose: () => void;
}

type PrintFormat = 'A4' | 'THERMAL' | 'STICKER';

export const PrintModal: React.FC<PrintModalProps> = ({
  service,
  isOpen,
  onClose,
}) => {
  const { companySettings } = useServices();
  const [format, setFormat] = useState<PrintFormat>('A4');

  if (!isOpen || !service) return null;

  const handlePrint = () => {
    window.print();
  };

  const barcodeSvg = generateBarcodeSvg(service.servisNo);
  const qrSvg = generateQrCodeSvg(
    `https://gorditbilgisayar.com/servis-takip?no=${service.servisNo}&tel=${encodeURIComponent(service.musteriTelefon)}`,
    format === 'STICKER' ? 60 : 90
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '900px', height: '90vh' }}
      >
        <div className="modal-header no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Printer size={20} color="#38bdf8" />
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Servis Çıktısı & Yazdır</h3>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>Format seçip doğrudan yazıcıya gönderin</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', background: 'rgba(15,23,42,0.6)', padding: '4px', borderRadius: '10px', gap: '4px' }}>
              <button
                type="button"
                className={`btn btn-sm ${format === 'A4' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFormat('A4')}
              >
                <FileText size={14} /> A4 Form
              </button>
              <button
                type="button"
                className={`btn btn-sm ${format === 'THERMAL' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFormat('THERMAL')}
              >
                <Receipt size={14} /> 80mm Termal
              </button>
              <button
                type="button"
                className={`btn btn-sm ${format === 'STICKER' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFormat('STICKER')}
              >
                <Tag size={14} /> Cihaz Etiketi
              </button>
            </div>

            <button type="button" className="btn btn-primary" onClick={handlePrint}>
              <Printer size={16} /> Yazdır
            </button>

            <button type="button" className="btn btn-secondary btn-icon" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="modal-body" style={{ background: '#334155', display: 'flex', justifyContent: 'center', padding: '24px', overflowY: 'auto' }}>
          {/* A4 FORMATI */}
          {format === 'A4' && (
            <div
              className="print-area"
              style={{
                width: '100%',
                maxWidth: '210mm',
                minHeight: '297mm',
                background: '#ffffff',
                color: '#0f172a',
                padding: '28px 32px',
                borderRadius: '6px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {/* Antet ve Başlık - Diza Yazılım Renkleri */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #e30613', paddingBottom: '12px', marginBottom: '16px' }}>
                  <div>
                    <h1 style={{ fontSize: '18px', fontWeight: 900, color: '#e30613', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                      {companySettings.firmaAdi}
                    </h1>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#1a237e' }}>
                      {companySettings.resmiUnvan}
                    </div>
                    <div style={{ color: '#475569', fontSize: '11px', marginTop: '2px' }}>
                      {companySettings.adres}
                    </div>
                    <div style={{ color: '#334155', fontSize: '11px', fontWeight: 600 }}>
                      Tel: {companySettings.telefon} | GSM: {companySettings.gsm} | {companySettings.email}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <div style={{ fontSize: '14px', fontWeight: 900, color: '#1a237e', textTransform: 'uppercase' }}>
                      {service.islemTuru === 'Teklif'
                        ? 'FİYAT TEKLİFİ & PROJE FORMU'
                        : service.servisTuru === 'DisServis'
                        ? 'SAHA MONTAJ & SERVİS TUTANAĞI'
                        : 'ATÖLYE SERVİS KABUL FORMU'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#e30613', fontWeight: 700, marginTop: '2px' }}>
                      {service.servisTuru === 'DisServis' ? '🚛 DIŞ SERVİS (SAHA)' : '🏠 İÇ SERVİS (ATÖLYE)'}
                    </div>
                    <div style={{ marginTop: '4px' }} dangerouslySetInnerHTML={{ __html: barcodeSvg }} />
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                      Tarih: {formatDateTime(service.gelisTarihi)}
                    </div>
                  </div>
                </div>

                {/* Müşteri ve Cihaz Tabloları */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                  {/* Sol: Müşteri */}
                  <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px' }}>
                    <div style={{ fontWeight: 700, borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '6px', color: '#0284c7' }}>
                      MÜŞTERİ BİLGİLERİ
                    </div>
                    <div><strong>Adı Soyadı:</strong> {service.musteriAdSoyad}</div>
                    <div><strong>Telefon / GSM:</strong> {service.musteriTelefon}</div>
                    {service.musteriEmail && <div><strong>E-Posta:</strong> {service.musteriEmail}</div>}
                    {service.musteriAdres && <div><strong>Adres:</strong> {service.musteriAdres}</div>}
                  </div>

                  {/* Sağ: Cihaz */}
                  <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px' }}>
                    <div style={{ fontWeight: 700, borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '6px', color: '#0284c7' }}>
                      CİHAZ VE GÜVENLİK
                    </div>
                    <div><strong>Cihaz Tipi:</strong> {service.cihazTipi}</div>
                    <div><strong>Marka / Model:</strong> {service.markaModel}</div>
                    <div><strong>Seri No / IMEI:</strong> {service.seriNoImei}</div>
                    {service.cihazSifresi && <div><strong>PIN / Şifre:</strong> {service.cihazSifresi}</div>}
                    <div><strong>Durum:</strong> {DURUMLAR[service.durum]?.label}</div>
                  </div>
                </div>

                {/* Aksesuar & Fiziksel Durum */}
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px', marginBottom: '14px' }}>
                  <div><strong>Teslim Alınan Aksesuarlar:</strong> {service.aksesuarlar.join(', ') || 'Yok'}</div>
                  {service.fizikselDurumNotu && (
                    <div style={{ marginTop: '4px', color: '#dc2626' }}>
                      <strong>Fiziksel Kusur / Hasar Notu:</strong> {service.fizikselDurumNotu}
                    </div>
                  )}
                </div>

                {/* Arıza & Şikayet */}
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px', marginBottom: '14px', background: '#f8fafc' }}>
                  <div style={{ fontWeight: 700, color: '#dc2626', marginBottom: '4px' }}>MÜŞTERİ ŞİKAYETİ / BİLDİRİLEN ARIZA:</div>
                  <div style={{ fontSize: '11px', color: '#1e293b' }}>{service.arizaTanimi}</div>
                </div>

                {/* Yapılan İşlemler (Varsa) */}
                {service.yapilanIslemler && (
                  <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px', marginBottom: '14px', background: '#f0fdf4' }}>
                    <div style={{ fontWeight: 700, color: '#16a34a', marginBottom: '4px' }}>YAPILAN İŞLEMLER / TEKNİK RAPOR:</div>
                    <div style={{ fontSize: '11px', color: '#1e293b' }}>{service.yapilanIslemler}</div>
                  </div>
                )}

                {/* Parça ve İşçilik Kalemleri Tablosu */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px', fontSize: '11px' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                      <th style={{ padding: '6px 8px', textAlign: 'left' }}>Hizmet / Parça Açıklaması</th>
                      <th style={{ padding: '6px 8px', textAlign: 'center', width: '50px' }}>Adet</th>
                      <th style={{ padding: '6px 8px', textAlign: 'right', width: '90px' }}>Birim</th>
                      <th style={{ padding: '6px 8px', textAlign: 'right', width: '90px' }}>Tutar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(service.satirlar || []).map(row => (
                      <tr key={row.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '6px 8px' }}>{row.tanim}</td>
                        <td style={{ padding: '6px 8px', textAlign: 'center' }}>{row.adet}</td>
                        <td style={{ padding: '6px 8px', textAlign: 'right' }}>{formatMoney(row.birimFiyat)}</td>
                        <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 600 }}>{formatMoney(row.toplamTutar)}</td>
                      </tr>
                    ))}
                    {(service.satirlar || []).length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ padding: '8px', textAlign: 'center', color: '#64748b' }}>
                          Arıza tespiti aşamasındadır. Fiyat onaydan sonra belirlenecektir.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Finansal Özet ve QR */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div dangerouslySetInnerHTML={{ __html: qrSvg }} />
                    <div style={{ fontSize: '10px', color: '#64748b', maxWidth: '240px' }}>
                      Bu QR kodu telefonunuzun kamerası ile okutarak servis sürecinizi canlı olarak takip edebilirsiniz.
                    </div>
                  </div>

                  <div style={{ width: '240px', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px', fontSize: '11px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span>Toplam Tutar:</span>
                      <strong>{formatMoney(service.toplamTutar)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', color: '#16a34a' }}>
                      <span>Alınan Kapora:</span>
                      <strong>{formatMoney(service.alinanKapora)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #cbd5e1', paddingTop: '4px', fontSize: '13px', fontWeight: 800, color: '#dc2626' }}>
                      <span>Kalan Tutar:</span>
                      <strong>{formatMoney(service.kalanTutar)}</strong>
                    </div>
                  </div>
                </div>

                {/* Servis Şartları */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px', fontSize: '9px', color: '#475569', lineHeight: 1.4, marginBottom: '24px' }}>
                  <div style={{ fontWeight: 700, marginBottom: '2px', color: '#1e293b' }}>SERVİS VE GARANTİ ŞARTLARI:</div>
                  <div style={{ whiteSpace: 'pre-line' }}>{companySettings.servisSartlariA4}</div>
                </div>
              </div>

              {/* İmza Alanı */}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px dashed #cbd5e1' }}>
                <div style={{ textAlign: 'center', width: '200px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700 }}>Cihazı Teslim Eden (Müşteri)</div>
                  <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{service.musteriAdSoyad}</div>
                  <div style={{ height: '40px', marginTop: '8px', borderBottom: '1px solid #000' }}></div>
                  <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '2px' }}>İmza</div>
                </div>

                <div style={{ textAlign: 'center', width: '200px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700 }}>Teslim Alan Yetkili Servis</div>
                  <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{companySettings.resmiUnvan}</div>
                  <div style={{ height: '40px', marginTop: '8px', borderBottom: '1px solid #000' }}></div>
                  <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '2px' }}>Kaşe / İmza</div>
                </div>
              </div>
            </div>
          )}

          {/* 80mm TERMAL FİŞ FORMATI */}
          {format === 'THERMAL' && (
            <div
              className="print-area"
              style={{
                width: '80mm',
                background: '#ffffff',
                color: '#000000',
                padding: '16px 12px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                fontSize: '11px',
                fontFamily: 'monospace',
                lineHeight: 1.3,
              }}
            >
              <div style={{ textAlign: 'center', borderBottom: '1px dashed #000', paddingBottom: '10px', marginBottom: '10px' }}>
                <div style={{ fontSize: '14px', fontWeight: 900 }}>{companySettings.firmaAdi}</div>
                <div style={{ fontSize: '10px' }}>{companySettings.resmiUnvan}</div>
                <div style={{ fontSize: '9px' }}>Tel: {companySettings.telefon}</div>
                <div style={{ fontSize: '9px' }}>GSM: {companySettings.gsm}</div>
                <div style={{ marginTop: '8px' }} dangerouslySetInnerHTML={{ __html: barcodeSvg }} />
                <div style={{ fontSize: '12px', fontWeight: 900, marginTop: '4px' }}>SERVİS KABUL FİŞİ</div>
              </div>

              <div style={{ marginBottom: '8px', fontSize: '10px' }}>
                <div><strong>Servis No:</strong> {service.servisNo}</div>
                <div><strong>Tarih:</strong> {formatDateTime(service.gelisTarihi)}</div>
                <div><strong>Müşteri:</strong> {service.musteriAdSoyad}</div>
                <div><strong>Telefon:</strong> {service.musteriTelefon}</div>
                <div><strong>Cihaz:</strong> {service.markaModel}</div>
                <div><strong>Seri No:</strong> {service.seriNoImei}</div>
                {service.cihazSifresi && <div><strong>Şifre:</strong> {service.cihazSifresi}</div>}
              </div>

              <div style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', padding: '6px 0', margin: '8px 0', fontSize: '10px' }}>
                <div><strong>Şikayet:</strong> {service.arizaTanimi}</div>
                {service.aksesuarlar.length > 0 && <div><strong>Aksesuar:</strong> {service.aksesuarlar.join(', ')}</div>}
              </div>

              <div style={{ marginBottom: '10px', fontSize: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Tahmini Tutar:</span>
                  <strong>{formatMoney(service.toplamTutar)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Alınan Kapora:</span>
                  <strong>{formatMoney(service.alinanKapora)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900 }}>
                  <span>Kalan Tutar:</span>
                  <strong>{formatMoney(service.kalanTutar)}</strong>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <div dangerouslySetInnerHTML={{ __html: qrSvg }} />
                <div style={{ fontSize: '9px', marginTop: '2px' }}>QR Kod ile Durum Sorgula</div>
              </div>

              <div style={{ fontSize: '8px', textAlign: 'center', borderTop: '1px dashed #000', paddingTop: '6px' }}>
                {companySettings.termalSartlar}
              </div>
            </div>
          )}

          {/* CİHAZ ÜZERİ YAPIŞKAN BARKOD ETİKETİ */}
          {format === 'STICKER' && (
            <div
              className="print-area"
              style={{
                width: '70mm',
                height: '40mm',
                background: '#ffffff',
                color: '#000000',
                padding: '6px 8px',
                borderRadius: '4px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                fontSize: '9px',
                fontFamily: 'monospace',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #000', paddingBottom: '2px' }}>
                <span style={{ fontWeight: 900, fontSize: '10px' }}>GÖRDİT SERVİS</span>
                <span style={{ fontWeight: 900, fontSize: '11px' }}>{service.servisNo}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '10px' }}>{service.musteriAdSoyad}</div>
                  <div>Tel: {service.musteriTelefon}</div>
                  <div>Cihaz: {service.markaModel.substring(0, 22)}</div>
                  {service.cihazSifresi && <div>Şifre: <strong>{service.cihazSifresi}</strong></div>}
                  <div style={{ fontSize: '8px', color: '#555' }}>Giriş: {service.gelisTarihi.slice(0, 10)}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div dangerouslySetInnerHTML={{ __html: qrSvg }} />
                </div>
              </div>

              <div style={{ textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: barcodeSvg }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
