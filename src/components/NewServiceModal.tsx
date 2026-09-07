/**
 * Diza Teknik Servis — Gördit Bilgisayar
 * Copyright © 2024-2026 Gördit Bilgisayar — Zafer GÖRGÜN
 * Mobil & Tablet Uyumlu Cihaz Kabul Formu
 */

import React, { useState } from 'react';
import {
  X,
  User,
  Smartphone,
  CheckSquare,
  Camera,
  Wrench,
  Save,
  Grid,
  FileText,
} from 'lucide-react';
import { useServices } from '../context/ServiceContext';
import {
  CIHAZ_TIPLERI,
  POPULER_MARKALAR,
  STANDART_AKSESUARLAR,
  STANDART_ARIZALAR,
  ON_HAZIR_FIZIKSEL_KONTROLLER,
} from '../lib/constants';
import { formatPhoneNumber } from '../lib/format';
import { PatternLock } from './PatternLock';
import type { TeknikServisItem, OdemeTuru } from '../types';

interface NewServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newService: TeknikServisItem) => void;
}

export const NewServiceModal: React.FC<NewServiceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { addService, technicians } = useServices();

  const [musteriAdSoyad, setMusteriAdSoyad] = useState('');
  const [musteriTelefon, setMusteriTelefon] = useState('');
  const [musteriEmail, setMusteriEmail] = useState('');
  const [musteriAdres, setMusteriAdres] = useState('');

  const [cihazTipi, setCihazTipi] = useState('Laptop / Dizüstü Bilgisayar');
  const [markaModel, setMarkaModel] = useState('');
  const [seriNoImei, setSeriNoImei] = useState('');
  const [cihazSifresi, setCihazSifresi] = useState('');
  const [showPatternLock, setShowPatternLock] = useState(false);
  const [kilitDeseni, setKilitDeseni] = useState<number[]>([]);

  const [secilenAksesuarlar, setSecilenAksesuarlar] = useState<string[]>([]);
  const [aksesuarDiger, setAksesuarDiger] = useState('');

  // Fiziksel Kontroller
  const [fizikselKontroller, setFizikselKontroller] = useState<Record<string, boolean>>({
    siviTemasi: false,
    ekranKirik: false,
    cizikVar: false,
    darbeVar: false,
    acilmiyor: false,
    sarjAlmiyor: false,
    asinIsinma: false,
    sesYok: false,
    kameraArizali: false,
  });
  const [fizikselDurumNotu, setFizikselDurumNotu] = useState('');

  const [arizaTanimi, setArizaTanimi] = useState('');
  const [fotograflar, setFotograflar] = useState<string[]>([]);

  const [atananTeknisyenId, setAtananTeknisyenId] = useState(technicians[0]?.id || '');
  const [oncelik, setOncelik] = useState<'Normal' | 'Acil' | 'Kritik'>('Normal');
  const [alinanKapora, setAlinanKapora] = useState<number>(0);
  const [odemeTuru, setOdemeTuru] = useState<OdemeTuru>('Nakit');

  if (!isOpen) return null;

  const handlePhoneChange = (val: string) => {
    setMusteriTelefon(formatPhoneNumber(val));
  };

  const toggleAksesuar = (aks: string) => {
    setSecilenAksesuarlar(prev =>
      prev.includes(aks) ? prev.filter(a => a !== aks) : [...prev, aks]
    );
  };

  const toggleFiziksel = (id: string) => {
    setFizikselKontroller(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFotograflar(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!musteriAdSoyad.trim()) {
      alert('Lütfen müşteri ad ve soyadını giriniz.');
      return;
    }
    if (!musteriTelefon.trim()) {
      alert('Lütfen müşteri telefon numarasını giriniz.');
      return;
    }
    if (!markaModel.trim()) {
      alert('Lütfen cihaz marka ve modelini giriniz.');
      return;
    }
    if (!arizaTanimi.trim()) {
      alert('Lütfen arıza veya müşteri şikayetini giriniz.');
      return;
    }

    const secilenTech = technicians.find(t => t.id === atananTeknisyenId);

    const newService = addService({
      musteriAdSoyad,
      musteriTelefon,
      musteriEmail,
      musteriAdres,
      cihazTipi,
      markaModel,
      seriNoImei: seriNoImei || 'BELİRTİLMEDİ',
      cihazSifresi,
      kilitDeseni: kilitDeseni.length > 0 ? kilitDeseni : undefined,
      aksesuarlar: secilenAksesuarlar,
      aksesuarDiger,
      siviTemasi: !!fizikselKontroller.siviTemasi,
      ekranKirik: !!fizikselKontroller.ekranKirik,
      cizikVar: !!fizikselKontroller.cizikVar,
      darbeVar: !!fizikselKontroller.darbeVar,
      acilmiyor: !!fizikselKontroller.acilmiyor,
      sarjAlmiyor: !!fizikselKontroller.sarjAlmiyor,
      asinIsinma: !!fizikselKontroller.asinIsinma,
      sesYok: !!fizikselKontroller.sesYok,
      kameraArizali: !!fizikselKontroller.kameraArizali,
      fizikselDurumNotu,
      arizaTanimi,
      fotograflar,
      durum: 'KabulEdildi',
      atananTeknisyenId,
      atananTeknisyenAd: secilenTech?.adSoyad,
      satirlar: [],
      iscilikUcreti: 0,
      parcaUcreti: 0,
      kdvTutari: 0,
      indirimTutari: 0,
      toplamTutar: 0,
      alinanKapora: Number(alinanKapora) || 0,
      kalanTutar: 0,
      odemeTuru,
      tahsilEdildi: false,
      garantiKapsaminda: false,
      garantiSuresiAy: 6,
      oncelik,
    });

    onSuccess(newService);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '960px' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-logo-icon" style={{ width: '32px', height: '32px' }}>
              <Wrench size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Yeni Servis & Cihaz Kabul</h3>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>Gördit Bilgisayar Servis Takip Fişi</p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-icon"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* 1. Bölüm: Müşteri Bilgileri */}
            <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '14px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <User size={16} /> 1. Müşteri Bilgileri
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Müşteri Adı Soyadı *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Örn: Ahmet YILMAZ"
                    value={musteriAdSoyad}
                    onChange={e => setMusteriAdSoyad(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Telefon / GSM * (0XXX XXX XX XX)</label>
                  <input
                    type="tel"
                    required
                    className="form-control"
                    placeholder="0(5XX) XXX XX XX"
                    value={musteriTelefon}
                    onChange={e => handlePhoneChange(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">E-Posta Adresi</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="musteri@ornek.com"
                    value={musteriEmail}
                    onChange={e => setMusteriEmail(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Adres / Semt / İlçe</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Örn: Mersin / Akdeniz"
                    value={musteriAdres}
                    onChange={e => setMusteriAdres(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* 2. Bölüm: Cihaz Bilgileri */}
            <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '14px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Smartphone size={16} /> 2. Cihaz & Güvenlik Bilgileri
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Cihaz Tipi</label>
                  <select
                    className="form-control"
                    value={cihazTipi}
                    onChange={e => setCihazTipi(e.target.value)}
                  >
                    {CIHAZ_TIPLERI.map(tip => (
                      <option key={tip} value={tip}>{tip}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Marka ve Model *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Örn: Asus ROG Strix G15 / iPhone 13"
                    value={markaModel}
                    onChange={e => setMarkaModel(e.target.value)}
                  />
                  {/* Popüler Marka Çipleri */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                    {POPULER_MARKALAR.slice(0, 8).map(m => (
                      <button
                        key={m}
                        type="button"
                        style={{
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: 'rgba(255,255,255,0.06)',
                          color: '#cbd5e1',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                        onClick={() => setMarkaModel(prev => (prev ? `${m} ${prev}` : m))}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Seri Numarası / IMEI</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Cihaz altındaki seri no veya IMEI"
                    value={seriNoImei}
                    onChange={e => setSeriNoImei(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">PIN / Giriş Şifresi</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Windows şifresi veya telefon PIN"
                    value={cihazSifresi}
                    onChange={e => setCihazSifresi(e.target.value)}
                  />
                </div>
              </div>

              {/* 3x3 Dokunmatik Desen Kilidi Seçeneği */}
              <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Grid size={15} /> 3x3 Dokunmatik Kilit Deseni (Android)
                  </span>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowPatternLock(!showPatternLock)}
                  >
                    {showPatternLock ? 'Deseni Kapat' : 'Desen Çiz / Düzenle'}
                  </button>
                </div>

                {showPatternLock && (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
                    <PatternLock
                      value={kilitDeseni}
                      onChange={pts => setKilitDeseni(pts)}
                      size={200}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 3. Bölüm: Fiziksel Kontroller ve Aksesuarlar */}
            <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '14px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <CheckSquare size={16} /> 3. Teslim Alınan Aksesuarlar & Fiziksel Durum
              </h4>

              {/* Aksesuar Seçim Çipleri */}
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">Birlikte Teslim Alınan Aksesuarlar:</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {STANDART_AKSESUARLAR.map(aks => {
                    const isSelected = secilenAksesuarlar.includes(aks);
                    return (
                      <button
                        key={aks}
                        type="button"
                        onClick={() => toggleAksesuar(aks)}
                        style={{
                          fontSize: '12px',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: isSelected ? 'var(--accent-gradient)' : 'rgba(255, 255, 255, 0.05)',
                          color: isSelected ? '#fff' : '#94a3b8',
                          border: isSelected ? 'none' : '1px solid var(--border-color)',
                          cursor: 'pointer',
                          fontWeight: isSelected ? 600 : 400,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {isSelected ? '✓ ' : '+ '}{aks}
                      </button>
                    );
                  })}
                </div>
                <div style={{ marginTop: '8px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Diğer teslim alınan aksesuarlar (opsiyonel)..."
                    value={aksesuarDiger}
                    onChange={e => setAksesuarDiger(e.target.value)}
                    style={{ height: '34px', fontSize: '12px' }}
                  />
                </div>
              </div>

              {/* Fiziksel Hasar Kontrol Kutuları */}
              <div style={{ marginBottom: '14px' }}>
                <label className="form-label">Girişteki Fiziksel Kusur & Hasar Durumu:</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                  {ON_HAZIR_FIZIKSEL_KONTROLLER.map(item => {
                    const isChecked = !!fizikselKontroller[item.id];
                    return (
                      <label
                        key={item.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: isChecked ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0,0,0,0.2)',
                          border: isChecked ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid var(--border-color)',
                          fontSize: '12px',
                          color: isChecked ? '#f87171' : '#cbd5e1',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleFiziksel(item.id)}
                          style={{ accentColor: '#ef4444' }}
                        />
                        <span>{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Fiziksel Durum Ek Notu</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Örn: Kasada sol altta hafif çatlak var, menteşe sert açılıyor."
                  value={fizikselDurumNotu}
                  onChange={e => setFizikselDurumNotu(e.target.value)}
                />
              </div>

              {/* Fotoğraf Yükleme */}
              <div style={{ marginTop: '14px' }}>
                <label className="form-label">Cihaz Giriş / Hasar Fotoğrafları</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <label
                    className="btn btn-secondary btn-sm"
                    style={{ cursor: 'pointer', display: 'inline-flex' }}
                  >
                    <Camera size={16} /> Fotoğraf Çek / Ekle
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      capture="environment"
                      style={{ display: 'none' }}
                      onChange={handlePhotoUpload}
                    />
                  </label>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {fotograflar.length} fotoğraf eklendi
                  </span>
                </div>

                {fotograflar.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {fotograflar.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        <img
                          src={img}
                          alt="Cihaz"
                          style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #38bdf8' }}
                        />
                        <button
                          type="button"
                          onClick={() => setFotograflar(prev => prev.filter((_, i) => i !== idx))}
                          style={{
                            position: 'absolute',
                            top: '-4px',
                            right: '-4px',
                            background: '#ef4444',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50%',
                            width: '18px',
                            height: '18px',
                            fontSize: '10px',
                            cursor: 'pointer',
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 4. Bölüm: Arıza Tanımı, Teknisyen ve Kapora */}
            <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '14px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <FileText size={16} /> 4. Arıza / Şikayet & Servis Önceliği
              </h4>

              <div className="form-group">
                <label className="form-label">Müşteri Şikayeti / Bildirilen Arıza *</label>
                <textarea
                  required
                  className="form-control"
                  rows={3}
                  placeholder="Müşterinin belirttiği arıza detayları..."
                  value={arizaTanimi}
                  onChange={e => setArizaTanimi(e.target.value)}
                />
                {/* Hazır Arıza Şablonları */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  {STANDART_ARIZALAR.slice(0, 6).map(ariza => (
                    <button
                      key={ariza}
                      type="button"
                      style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: 'rgba(255,255,255,0.06)',
                        color: '#94a3b8',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      onClick={() => setArizaTanimi(prev => (prev ? `${prev}. ${ariza}` : ariza))}
                    >
                      + {ariza}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Atanan Teknisyen</label>
                  <select
                    className="form-control"
                    value={atananTeknisyenId}
                    onChange={e => setAtananTeknisyenId(e.target.value)}
                  >
                    {technicians.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.adSoyad} ({t.uzmanlik})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Öncelik Seviyesi</label>
                  <select
                    className="form-control"
                    value={oncelik}
                    onChange={e => setOncelik(e.target.value as any)}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Acil">Acil (Öncelikli)</option>
                    <option value="Kritik">Kritik (Aynı Gün Teslim)</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Alınan Kapora (TL)</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    className="form-control"
                    placeholder="0.00"
                    value={alinanKapora || ''}
                    onChange={e => setAlinanKapora(parseFloat(e.target.value) || 0)}
                  />
                </div>

                {alinanKapora > 0 && (
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Kapora Ödeme Türü</label>
                    <select
                      className="form-control"
                      value={odemeTuru}
                      onChange={e => setOdemeTuru(e.target.value as OdemeTuru)}
                    >
                      <option value="Nakit">Nakit</option>
                      <option value="KrediKarti">Kredi Kartı</option>
                      <option value="HavaleEFT">Havale / EFT</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              <Save size={18} /> Cihazı Kabul Et & Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
