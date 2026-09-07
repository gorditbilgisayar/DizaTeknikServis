/**
 * Diza Teknik Servis — Gördit Bilgisayar
 * Copyright © 2024-2026 Gördit Bilgisayar — Zafer GÖRGÜN
 * Sade, Kolay Kullanılabilir ve Hızlı Servis & Montaj Kayıt Formu
 */

import React, { useState } from 'react';
import {
  X,
  Store,
  Truck,
  Plus,
  ChevronDown,
  ChevronUp,
  Save,
  Wrench,
  Camera,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useServices } from '../context/ServiceContext';
import {
  FAALIYET_ALANLARI,
  ISLEM_TURLERI,
  STANDART_AKSESUARLAR,
  ON_HAZIR_FIZIKSEL_KONTROLLER,
} from '../lib/constants';
import { formatPhoneNumber } from '../lib/format';
import type {
  TeknikServisItem,
  ServisTuru,
  FaaliyetAlani,
  IslemTuru,
  TeklifDurumu,
  OdemeTuru,
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

  // Temel Servis Bilgileri
  const [servisTuru, setServisTuru] = useState<ServisTuru>('IcServis');
  const [faaliyetAlani, setFaaliyetAlani] = useState<FaaliyetAlani>('GuvenlikKamerasi');
  const [islemTuru, setIslemTuru] = useState<IslemTuru>('ArizaCozum');
  const [teklifDurumu, setTeklifDurumu] = useState<TeklifDurumu>('Hazirlaniyor');

  // Müşteri Bilgileri
  const [musteriAdSoyad, setMusteriAdSoyad] = useState('');
  const [musteriTelefon, setMusteriTelefon] = useState('');
  const [musteriAdres, setMusteriAdres] = useState('');

  // Cihaz ve İş Detayı
  const [markaModel, setMarkaModel] = useState('');
  const [arizaTanimi, setArizaTanimi] = useState('');
  const [oncelik, setOncelik] = useState<'Normal' | 'Acil' | 'Kritik'>('Normal');
  const [atananTeknisyenId, setAtananTeknisyenId] = useState(technicians[0]?.id || '');
  const [alinanKapora, setAlinanKapora] = useState<number>(0);
  const [odemeTuru, setOdemeTuru] = useState<OdemeTuru>('Nakit');

  // Dış Servis (Saha)
  const [sahaAdresi, setSahaAdresi] = useState('');
  const [sahaRandevuTarihi, setSahaRandevuTarihi] = useState('');

  // Gelişmiş / Ekstra Bilgiler (Katlanabilir - Kullanıcıyı yormaz)
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [seriNoImei, setSeriNoImei] = useState('');
  const [cihazSifresi, setCihazSifresi] = useState('');
  const [secilenAksesuarlar, setSecilenAksesuarlar] = useState<string[]>([]);
  const [fizikselKontroller, setFizikselKontroller] = useState<Record<string, boolean>>({});
  const [fotograflar, setFotograflar] = useState<string[]>([]);

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
      alert('Lütfen Müşteri veya Firma adını giriniz.');
      return;
    }
    if (!musteriTelefon.trim() || musteriTelefon.length < 10) {
      alert('Lütfen geçerli bir telefon numarası giriniz (Örn: 0(541) 608 53 44).');
      return;
    }
    if (!markaModel.trim()) {
      alert('Lütfen Cihaz / Sistem veya Ürün modelini giriniz.');
      return;
    }
    if (!arizaTanimi.trim()) {
      alert('Lütfen Arıza / Yapılacak İş veya Montaj açıklamasını giriniz.');
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

      musteriAdSoyad,
      musteriTelefon,
      musteriEmail: '',
      musteriAdres: musteriAdres || sahaAdresi,
      cihazTipi: FAALIYET_ALANLARI[faaliyetAlani]?.label || 'Genel Cihaz',
      markaModel,
      seriNoImei: seriNoImei || 'BELİRTİLMEDİ',
      cihazSifresi,
      aksesuarlar: secilenAksesuarlar,
      siviTemasi: !!fizikselKontroller.siviTemasi,
      ekranKirik: !!fizikselKontroller.ekranKirik,
      cizikVar: !!fizikselKontroller.cizikVar,
      darbeVar: !!fizikselKontroller.darbeVar,
      acilmiyor: !!fizikselKontroller.acilmiyor,
      sarjAlmiyor: !!fizikselKontroller.sarjAlmiyor,
      asinIsinma: !!fizikselKontroller.asinIsinma,
      sesYok: !!fizikselKontroller.sesYok,
      kameraArizali: !!fizikselKontroller.kameraArizali,
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
        style={{ maxWidth: '680px' }}
      >
        {/* Başlık */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="brand-logo-box">DİZA</div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-main)' }}>
                Yeni Servis & Montaj Kaydı Aç
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Hızlı, sade ve kolay kayıt formu
              </p>
            </div>
          </div>
          <button type="button" className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* 1. Servis Lokasyonu (2 Büyük Sade Buton) */}
            <div>
              <label className="form-label" style={{ fontWeight: 700 }}>
                1. Servis Yeri / Lokasyon
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setServisTuru('IcServis')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: servisTuru === 'IcServis' ? '2px solid var(--diza-navy)' : '1px solid var(--border)',
                    background: servisTuru === 'IcServis' ? '#e8eaf6' : 'var(--bg-card)',
                    color: servisTuru === 'IcServis' ? 'var(--diza-navy)' : 'var(--text-main)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  <Store size={20} />
                  <span>İç Servis (Atölye / Mağaza)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setServisTuru('DisServis')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: servisTuru === 'DisServis' ? '2px solid var(--diza-red)' : '1px solid var(--border)',
                    background: servisTuru === 'DisServis' ? 'var(--diza-red-light)' : 'var(--bg-card)',
                    color: servisTuru === 'DisServis' ? 'var(--diza-red)' : 'var(--text-main)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  <Truck size={20} />
                  <span>Dış Servis (Saha / Montaj)</span>
                </button>
              </div>
            </div>

            {/* 2. Müşteri Bilgileri */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Müşteri Ad Soyad / Firma Adı *
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Örn: Ahmet Yılmaz veya ABC Ltd. Şti."
                  value={musteriAdSoyad}
                  onChange={e => setMusteriAdSoyad(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Telefon Numarası *
                </label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="0(541) 608 53 44"
                  value={musteriTelefon}
                  onChange={e => handlePhoneChange(e.target.value)}
                  maxLength={17}
                  required
                />
              </div>
            </div>

            {/* Dış Servis İse Saha Adresi */}
            {servisTuru === 'DisServis' && (
              <div style={{ background: 'var(--diza-red-light)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #fecdd3' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                  <div>
                    <label className="form-label" style={{ fontWeight: 700, color: 'var(--diza-red)' }}>
                      <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                      Montaj / Saha Adresi *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Örn: Çamlıca Mah. Atatürk Cad. No:14 Kat:2 Mersin"
                      value={sahaAdresi}
                      onChange={e => setSahaAdresi(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontWeight: 700, color: 'var(--diza-red)' }}>
                      <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                      Randevu Tarihi
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={sahaRandevuTarihi}
                      onChange={e => setSahaRandevuTarihi(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. Sektör / Faaliyet & İşlem Türü */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Faaliyet Alanı / Sistem Türü
                </label>
                <select
                  className="form-control"
                  value={faaliyetAlani}
                  onChange={e => setFaaliyetAlani(e.target.value as FaaliyetAlani)}
                >
                  <option value="GuvenlikKamerasi">📹 Güvenlik Kamerası (CCTV/IP)</option>
                  <option value="AlarmSistemi">🚨 Hırsız Alarm Sistemi</option>
                  <option value="Bilgisayar">💻 Bilgisayar & Notebook & Server</option>
                  <option value="Network">🌐 Network & Ağ & Yapısal Kablolama</option>
                  <option value="YanginAlarm">🔥 Yangın Alarm & Algılama</option>
                  <option value="Yazilim">💻 Yazılım & Muhasebe (Diza ERP/SQL)</option>
                </select>
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Yapılacak İşlem Türü
                </label>
                <select
                  className="form-control"
                  value={islemTuru}
                  onChange={e => setIslemTuru(e.target.value as IslemTuru)}
                >
                  <option value="ArizaCozum">🔧 Arıza Tespiti & Onarım</option>
                  <option value="Montaj">🔩 Sıfır Montaj & Devreye Alma</option>
                  <option value="Teklif">📄 Fiyat Teklifi & Keşif</option>
                </select>
              </div>
            </div>

            {/* 4. Cihaz / Model ve Arıza Açıklaması */}
            <div>
              <label className="form-label" style={{ fontWeight: 700 }}>
                Cihaz / Sistem / Ürün Modeli *
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Örn: 8 Kamera Seti + NVR Kayıt Cihazı veya Asus Zenbook Laptop"
                value={markaModel}
                onChange={e => setMarkaModel(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: 700 }}>
                Arıza / Müşteri Talebi / İş Açıklaması *
              </label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="Örn: 2 kamera gece görüntüsü vermiyor, adaptör kontrol edilecek veya yeni depoya 4 adet IP kamera ve kablo çekimi yapılacak."
                value={arizaTanimi}
                onChange={e => setArizaTanimi(e.target.value)}
                required
              />
            </div>

            {/* 5. Teknisyen, Öncelik ve Kapora */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div>
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

              <div>
                <label className="form-label">Öncelik Durumu</label>
                <select
                  className="form-control"
                  value={oncelik}
                  onChange={e => setOncelik(e.target.value as any)}
                >
                  <option value="Normal">Normal</option>
                  <option value="Acil">⚠️ Acil</option>
                  <option value="Kritik">🔥 Kritik Öncelikli</option>
                </select>
              </div>

              <div>
                <label className="form-label">Alınan Kapora (TL)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="0"
                  value={alinanKapora || ''}
                  onChange={e => setAlinanKapora(Number(e.target.value))}
                />
              </div>
            </div>

            {/* İsteğe Bağlı Ekstra Detaylar Butonu (Akordiyon) */}
            <div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', justifyContent: 'space-between', padding: '8px 12px' }}
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <span>
                  {showAdvanced ? '− Ekstra Detayları Gizle' : '+ Aksesuar, Seri No, Şifre veya Fiziksel Kontrol Ekle (İsteğe Bağlı)'}
                </span>
                {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showAdvanced && (
                <div
                  style={{
                    marginTop: '10px',
                    padding: '14px',
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {/* Seri No ve Şifre */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label className="form-label">Seri No / IMEI / Barkod</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="İsteğe bağlı"
                        value={seriNoImei}
                        onChange={e => setSeriNoImei(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label">Cihaz / DVR Giriş Şifresi</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Örn: 123456 veya admin"
                        value={cihazSifresi}
                        onChange={e => setCihazSifresi(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Aksesuarlar */}
                  <div>
                    <label className="form-label" style={{ fontWeight: 600 }}>Teslim Alınan Aksesuarlar</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {STANDART_AKSESUARLAR.map(aks => {
                        const isChecked = secilenAksesuarlar.includes(aks);
                        return (
                          <button
                            key={aks}
                            type="button"
                            onClick={() => toggleAksesuar(aks)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '16px',
                              border: isChecked ? '1px solid var(--diza-navy)' : '1px solid var(--border)',
                              background: isChecked ? 'var(--diza-navy)' : 'var(--bg-card)',
                              color: isChecked ? '#fff' : 'var(--text-muted)',
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                          >
                            {aks} {isChecked && '✓'}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Fiziksel Kontrol */}
                  <div>
                    <label className="form-label" style={{ fontWeight: 600 }}>Fiziksel Durum Kontrolleri</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {ON_HAZIR_FIZIKSEL_KONTROLLER.map(item => {
                        const isChecked = !!fizikselKontroller[item.id];
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleFiziksel(item.id)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '16px',
                              border: isChecked ? '1px solid var(--diza-red)' : '1px solid var(--border)',
                              background: isChecked ? 'var(--diza-red-light)' : 'var(--bg-card)',
                              color: isChecked ? 'var(--diza-red)' : 'var(--text-muted)',
                              fontSize: '12px',
                              cursor: 'pointer',
                              fontWeight: isChecked ? 600 : 400,
                            }}
                          >
                            {item.label} {isChecked && '⚠️'}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal Alt Butonları */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Vazgeç
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 700 }}
            >
              <Save size={18} />
              <span>SERVİS KAYDINI AÇ VE KAYDET</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
