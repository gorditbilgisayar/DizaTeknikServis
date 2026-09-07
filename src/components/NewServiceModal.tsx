/**
 * Diza Teknik Servis — Gördit Bilgisayar
 * Copyright © 2024-2026 Gördit Bilgisayar — Zafer GÖRGÜN
 * İç / Dış Servis, Kamera, Alarm, Network, Yangın, Yazılım ve Montaj/Teklif Formu
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
  Truck,
  Store,
  Video,
  BellRing,
  Network,
  Flame,
  Code2,
  Hammer,
  FileSpreadsheet,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useServices } from '../context/ServiceContext';
import {
  CIHAZ_TIPLERI,
  POPULER_MARKALAR,
  STANDART_AKSESUARLAR,
  STANDART_ARIZALAR,
  ON_HAZIR_FIZIKSEL_KONTROLLER,
  FAALIYET_ALANLARI,
  ISLEM_TURLERI,
  SERVIS_TURLERI,
} from '../lib/constants';
import { formatPhoneNumber } from '../lib/format';
import { PatternLock } from './PatternLock';
import type {
  TeknikServisItem,
  OdemeTuru,
  ServisTuru,
  FaaliyetAlani,
  IslemTuru,
  TeklifDurumu,
} from '../types';

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

  // Servis ve Faaliyet Seçimi
  const [servisTuru, setServisTuru] = useState<ServisTuru>('IcServis');
  const [faaliyetAlani, setFaaliyetAlani] = useState<FaaliyetAlani>('GuvenlikKamerasi');
  const [islemTuru, setIslemTuru] = useState<IslemTuru>('ArizaCozum');
  const [teklifDurumu, setTeklifDurumu] = useState<TeklifDurumu>('Hazirlaniyor');

  // Dış Servis (Saha) Bilgileri
  const [sahaAdresi, setSahaAdresi] = useState('');
  const [sahaRandevuTarihi, setSahaRandevuTarihi] = useState('');
  const [sahaEkibi, setSahaEkibi] = useState('');
  const [sahaNotu, setSahaNotu] = useState('');

  // Müşteri Bilgileri
  const [musteriAdSoyad, setMusteriAdSoyad] = useState('');
  const [musteriTelefon, setMusteriTelefon] = useState('');
  const [musteriEmail, setMusteriEmail] = useState('');
  const [musteriAdres, setMusteriAdres] = useState('');

  // Cihaz ve Donanım
  const [cihazTipi, setCihazTipi] = useState('IP Kamera / Dome / Bullet');
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
      alert('Lütfen müşteri / firma adını giriniz.');
      return;
    }
    if (!musteriTelefon.trim()) {
      alert('Lütfen telefon numarasını giriniz.');
      return;
    }
    if (!markaModel.trim()) {
      alert('Lütfen sistem veya cihaz modelini giriniz.');
      return;
    }
    if (!arizaTanimi.trim()) {
      alert('Lütfen arıza veya talep açıklamasını giriniz.');
      return;
    }

    const secilenTech = technicians.find(t => t.id === atananTeknisyenId);

    const newService = addService({
      servisTuru,
      faaliyetAlani,
      islemTuru,
      teklifDurumu: islemTuru === 'Teklif' ? teklifDurumu : 'TeklifYok',
      sahaAdresi: servisTuru === 'DisServis' ? (sahaAdresi || musteriAdres) : undefined,
      sahaRandevuTarihi: servisTuru === 'DisServis' ? sahaRandevuTarihi : undefined,
      sahaEkibi: servisTuru === 'DisServis' ? sahaEkibi : undefined,
      sahaNotu: servisTuru === 'DisServis' ? sahaNotu : undefined,

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
      durum: islemTuru === 'Teklif' ? 'OnayBekliyor' : 'KabulEdildi',
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
      garantiSuresiAy: 24,
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
        style={{ maxWidth: '980px' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-logo-icon" style={{ width: '34px', height: '34px' }}>
              <Wrench size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Yeni Servis & Montaj & Teklif Kaydı</h3>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>Diza Yazılım & Gördit Bilgisayar</p>
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
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* 1. Bölüm: Servis Lokasyonu (İç Servis / Dış Servis) ve İşlem Türü */}
            <div style={{ background: 'rgba(26, 35, 126, 0.15)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  1. Servis Türü & Lokasyon
                </span>
                <span style={{ fontSize: '12px', color: '#38bdf8' }}>Atölye içi veya Müşteri yerinde saha</span>
              </div>

              {/* İç / Dış Servis Butonları */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <button
                  type="button"
                  onClick={() => setServisTuru('IcServis')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '12px',
                    borderRadius: '10px',
                    background: servisTuru === 'IcServis' ? 'var(--navy-gradient)' : 'rgba(15, 23, 42, 0.6)',
                    border: servisTuru === 'IcServis' ? '2px solid #38bdf8' : '1px solid var(--border-color)',
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '14px',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <Store size={20} color={servisTuru === 'IcServis' ? '#38bdf8' : '#94a3b8'} />
                  <div>
                    <div>İç Servis (Atölye / Mağaza)</div>
                    <div style={{ fontSize: '11px', fontWeight: 400, color: '#cbd5e1' }}>Cihaz atölyemize teslim alındı</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setServisTuru('DisServis')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '12px',
                    borderRadius: '10px',
                    background: servisTuru === 'DisServis' ? 'var(--accent-gradient)' : 'rgba(15, 23, 42, 0.6)',
                    border: servisTuru === 'DisServis' ? '2px solid #ff6b72' : '1px solid var(--border-color)',
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '14px',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <Truck size={20} color={servisTuru === 'DisServis' ? '#fff' : '#94a3b8'} />
                  <div>
                    <div>Dış Servis (Saha / Montaj / Keşif)</div>
                    <div style={{ fontSize: '11px', fontWeight: 400, color: '#ffe5e7' }}>Müşteri yerinde montaj & müdahale</div>
                  </div>
                </button>
              </div>

              {/* Faaliyet Alanı Seçimi */}
              <div style={{ marginBottom: '12px' }}>
                <label className="form-label">Hizmet / Faaliyet Alanı:</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
                  {Object.entries(FAALIYET_ALANLARI).map(([k, v]) => {
                    const isSelected = faaliyetAlani === k;
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setFaaliyetAlani(k as FaaliyetAlani)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          background: isSelected ? 'rgba(227, 6, 19, 0.25)' : 'rgba(0,0,0,0.25)',
                          border: isSelected ? '1px solid var(--logo-red)' : '1px solid var(--border-color)',
                          color: isSelected ? '#fff' : '#94a3b8',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: isSelected ? 700 : 500,
                          textAlign: 'left',
                        }}
                      >
                        {k === 'GuvenlikKamerasi' && <Video size={15} color={v.color} />}
                        {k === 'AlarmSistemi' && <BellRing size={15} color={v.color} />}
                        {k === 'Bilgisayar' && <Smartphone size={15} color={v.color} />}
                        {k === 'Network' && <Network size={15} color={v.color} />}
                        {k === 'YanginAlarm' && <Flame size={15} color={v.color} />}
                        {k === 'Yazilim' && <Code2 size={15} color={v.color} />}
                        {k === 'Diger' && <Wrench size={15} color={v.color} />}
                        <span>{v.label.split('&')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* İşlem Türü (Arıza / Montaj / Teklif / Keşif / Bakım) */}
              <div>
                <label className="form-label">İşlem Türü:</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {Object.entries(ISLEM_TURLERI).map(([k, v]) => {
                    const isSelected = islemTuru === k;
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setIslemTuru(k as IslemTuru)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: isSelected ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.05)',
                          border: isSelected ? 'none' : '1px solid var(--border-color)',
                          color: isSelected ? '#fff' : '#cbd5e1',
                          fontSize: '12px',
                          fontWeight: isSelected ? 700 : 500,
                          cursor: 'pointer',
                        }}
                      >
                        {v.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Eğer Dış Servis İse Saha Bilgileri Alanı */}
              {servisTuru === 'DisServis' && (
                <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px dashed rgba(255,255,255,0.1)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} color="#ff6b72" /> Montaj & Saha Adresi
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Örn: Toroslar Mah. Organize San. 3. Blok No:12"
                      value={sahaAdresi}
                      onChange={e => setSahaAdresi(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} color="#38bdf8" /> Randevu & Montaj Tarihi/Saati
                    </label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={sahaRandevuTarihi}
                      onChange={e => setSahaRandevuTarihi(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Saha Ekibi / Teknisyenler</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Örn: Murat Usta & Caner Teknisyen (Araç: 33 AB 123)"
                      value={sahaEkibi}
                      onChange={e => setSahaEkibi(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Saha Notu (İskele, Merdiven, Özel İzin)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Örn: Tavan 6 metre, merdiven götürülecek."
                      value={sahaNotu}
                      onChange={e => setSahaNotu(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2. Bölüm: Müşteri Bilgileri */}
            <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '13px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 700 }}>
                <User size={16} /> 2. Müşteri / Firma Bilgileri
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Müşteri / Firma Adı *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Örn: Toros Lojistik A.Ş. veya Ahmet YILMAZ"
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
                    placeholder="info@firma.com"
                    value={musteriEmail}
                    onChange={e => setMusteriEmail(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Şehir / İlçe / Fatura Adresi</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Mersin / Akdeniz"
                    value={musteriAdres}
                    onChange={e => setMusteriAdres(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* 3. Bölüm: Cihaz / Sistem Tanımı */}
            <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '13px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 700 }}>
                <Smartphone size={16} /> 3. Sistem & Cihaz Tanımı
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Sistem / Donanım Tipi</label>
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
                    placeholder="Örn: Dahua 16 Kanal NVR / Paradox SP4000"
                    value={markaModel}
                    onChange={e => setMarkaModel(e.target.value)}
                  />
                  {/* Popüler Marka Çipleri */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                    {POPULER_MARKALAR.slice(0, 9).map(m => (
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
                  <label className="form-label">Seri No / IMEI / Mac Adresi</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Seri numarası veya Mac adresi"
                    value={seriNoImei}
                    onChange={e => setSeriNoImei(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Sistem Şifresi / PIN / Port</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="NVR/Router şifresi veya Windows PIN"
                    value={cihazSifresi}
                    onChange={e => setCihazSifresi(e.target.value)}
                  />
                </div>
              </div>

              {/* Android Desen Kilidi (İhtiyaç Halinde) */}
              <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Grid size={14} /> Android 3x3 Kilit Deseni (Mobil/Tablet için)
                  </span>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowPatternLock(!showPatternLock)}
                  >
                    {showPatternLock ? 'Kapat' : 'Desen Çiz'}
                  </button>
                </div>

                {showPatternLock && (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
                    <PatternLock
                      value={kilitDeseni}
                      onChange={pts => setKilitDeseni(pts)}
                      size={180}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 4. Bölüm: Arıza & Montaj Talebi & Aksesuarlar */}
            <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '13px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 700 }}>
                <FileText size={16} /> 4. Arıza / Talep / Montaj Detayı & Şikayet
              </h4>

              <div className="form-group">
                <label className="form-label">Müşteri Talebi / Arıza Açıklaması *</label>
                <textarea
                  required
                  className="form-control"
                  rows={3}
                  placeholder="Yapılacak montaj, arıza tespiti veya teklif detaylarını yazınız..."
                  value={arizaTanimi}
                  onChange={e => setArizaTanimi(e.target.value)}
                />
                {/* Hazır Arıza/Montaj Şablonları */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '6px' }}>
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

              {/* Aksesuarlar */}
              <div style={{ marginBottom: '12px' }}>
                <label className="form-label">Teslim Alınan Parça & Ekipmanlar:</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {STANDART_AKSESUARLAR.map(aks => {
                    const isSelected = secilenAksesuarlar.includes(aks);
                    return (
                      <button
                        key={aks}
                        type="button"
                        onClick={() => toggleAksesuar(aks)}
                        style={{
                          fontSize: '11px',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: isSelected ? 'var(--accent-gradient)' : 'rgba(255, 255, 255, 0.05)',
                          color: isSelected ? '#fff' : '#94a3b8',
                          border: isSelected ? 'none' : '1px solid var(--border-color)',
                          cursor: 'pointer',
                          fontWeight: isSelected ? 700 : 400,
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

              {/* Fotoğraf Ekleme */}
              <div>
                <label className="form-label">Saha / Keşif / Cihaz Fotoğrafları</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                    <Camera size={14} /> Fotoğraf Çek / Yükle
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
              </div>
            </div>

            {/* 5. Bölüm: Teknisyen & Kapora */}
            <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Sorumlu Teknisyen / Uzman</label>
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
                  <label className="form-label">Öncelik</label>
                  <select
                    className="form-control"
                    value={oncelik}
                    onChange={e => setOncelik(e.target.value as any)}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Acil">Acil (Öncelikli)</option>
                    <option value="Kritik">Kritik (Aynı Gün / OSB)</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Alınan Kapora (TL)</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    className="form-control"
                    placeholder="0.00"
                    value={alinanKapora || ''}
                    onChange={e => setAlinanKapora(parseFloat(e.target.value) || 0)}
                  />
                </div>

                {alinanKapora > 0 && (
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Kapora Ödeme Kanalı</label>
                    <select
                      className="form-control"
                      value={odemeTuru}
                      onChange={e => setOdemeTuru(e.target.value as OdemeTuru)}
                    >
                      <option value="Nakit">Nakit</option>
                      <option value="KrediKarti">Kredi Kartı / POS</option>
                      <option value="HavaleEFT">Banka Havale / EFT</option>
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
              <Save size={18} /> Kaydet & Fiş Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
