/**
 * Diza Teknik Servis — Gördit Bilgisayar
 * Copyright © 2024-2026 Gördit Bilgisayar — Zafer GÖRGÜN
 * Sade, Kolay Kullanılabilir ve Hızlı Servis Kayıt Formu
 */

import React, { useState } from 'react';
import {
  X,
  Save,
  Wrench,
  User,
  Phone,
  MapPin,
  Mail,
  AlertCircle,
  Briefcase,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useServices } from '../context/ServiceContext';
import { FAALIYET_ALANLARI } from '../lib/constants';
import { formatPhoneNumber } from '../lib/format';
import type {
  TeknikServisItem,
  FaaliyetAlani,
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

  // Kullanıcının talep ettiği ana alanlar
  const [musteriAdSoyad, setMusteriAdSoyad] = useState('');
  const [musteriTelefon, setMusteriTelefon] = useState('');
  const [musteriAdres, setMusteriAdres] = useState('');
  const [musteriEmail, setMusteriEmail] = useState('');
  const [faaliyetAlani, setFaaliyetAlani] = useState<FaaliyetAlani>('GuvenlikKamerasi');
  const [arizaTanimi, setArizaTanimi] = useState('');

  // İsteğe bağlı ek bilgiler
  const [showExtra, setShowExtra] = useState(false);
  const [cihazModel, setCihazModel] = useState('');
  const [seriNo, setSeriNo] = useState('');
  const [oncelik, setOncelik] = useState<'Normal' | 'Acil' | 'Kritik'>('Normal');
  const [atananTeknisyenId, setAtananTeknisyenId] = useState(technicians[0]?.id || '');
  const [alinanKapora, setAlinanKapora] = useState<number>(0);
  const [odemeTuru, setOdemeTuru] = useState<OdemeTuru>('Nakit');

  if (!isOpen) return null;

  const handlePhoneChange = (val: string) => {
    setMusteriTelefon(formatPhoneNumber(val));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!musteriAdSoyad.trim()) {
      alert('Lütfen Müşteri Adı Soyadı veya Firma Adını giriniz.');
      return;
    }
    if (!musteriTelefon.trim() || musteriTelefon.length < 10) {
      alert('Lütfen geçerli bir telefon numarası giriniz (Örn: 0(541) 608 53 44).');
      return;
    }
    if (!arizaTanimi.trim()) {
      alert('Lütfen Müşteri Şikayeti veya Arıza/İş tanımını giriniz.');
      return;
    }

    const secilenTech = technicians.find(t => t.id === atananTeknisyenId);
    const secilenFaaliyetLabel = FAALIYET_ALANLARI[faaliyetAlani]?.label || 'Genel Servis';

    const newService = addService({
      servisTuru: 'IcServis', // Standart tek tip servis
      faaliyetAlani,
      islemTuru: 'ArizaCozum',
      teklifDurumu: 'TeklifYok',

      musteriAdSoyad: musteriAdSoyad.trim(),
      musteriTelefon: musteriTelefon.trim(),
      musteriEmail: musteriEmail.trim() || undefined,
      musteriAdres: musteriAdres.trim() || undefined,
      sahaAdresi: musteriAdres.trim() || undefined,

      cihazTipi: secilenFaaliyetLabel,
      markaModel: cihazModel.trim() || secilenFaaliyetLabel,
      seriNoImei: seriNo.trim() || 'BELİRTİLMEDİ',
      arizaTanimi: arizaTanimi.trim(),

      aksesuarlar: [],
      siviTemasi: false,
      ekranKirik: false,
      cizikVar: false,
      darbeVar: false,
      acilmiyor: false,
      sarjAlmiyor: false,
      asinIsinma: false,
      sesYok: false,
      kameraArizali: false,
      fotograflar: [],

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
        style={{ maxWidth: '620px', borderRadius: '16px' }}
      >
        {/* Başlık */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-logo-box">DİZA</div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                Yeni Servis Kaydı
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Hızlı ve pratik müşteri servis kayıt formu
              </p>
            </div>
          </div>
          <button type="button" className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px' }}>
            
            {/* 1. Müşteri Adı Soyadı / Firma Adı */}
            <div>
              <label className="form-label" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={15} color="var(--diza-navy)" />
                <span>Adı Soyadı ve / veya Firma Adı *</span>
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

            {/* 2. Telefon & Mail (Yan Yana) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
              <div>
                <label className="form-label" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={15} color="var(--diza-navy)" />
                  <span>Telefon Numarası *</span>
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

              <div>
                <label className="form-label" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={15} color="var(--text-muted)" />
                  <span>E-Posta (Mail)</span>
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="musteri@firma.com"
                  value={musteriEmail}
                  onChange={e => setMusteriEmail(e.target.value)}
                />
              </div>
            </div>

            {/* 3. Adres */}
            <div>
              <label className="form-label" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={15} color="var(--diza-navy)" />
                <span>Adres</span>
              </label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="Müşteri veya montaj yapılacak yerin açık adresi..."
                value={musteriAdres}
                onChange={e => setMusteriAdres(e.target.value)}
              />
            </div>

            {/* 4. Servis Türü */}
            <div>
              <label className="form-label" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Briefcase size={15} color="var(--diza-navy)" />
                <span>Servis Türü *</span>
              </label>
              <select
                className="form-control"
                value={faaliyetAlani}
                onChange={e => setFaaliyetAlani(e.target.value as FaaliyetAlani)}
                style={{ fontWeight: 600, padding: '10px 12px' }}
              >
                <option value="GuvenlikKamerasi">📹 Güvenlik Kamerası (CCTV / IP)</option>
                <option value="AlarmSistemi">🚨 Hırsız Alarm Sistemi</option>
                <option value="Bilgisayar">💻 Bilgisayar & Donanım & Sunucu</option>
                <option value="Network">🌐 Network & Ağ & Yapısal Kablolama</option>
                <option value="YanginAlarm">🔥 Yangın Alarm & Algılama</option>
                <option value="Yazilim">📊 Yazılım & Ticari Muhasebe (Diza ERP)</option>
                <option value="Diger">📦 Diğer Teknik Hizmetler</option>
              </select>
            </div>

            {/* 5. Müşteri Şikayeti */}
            <div>
              <label className="form-label" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={15} color="var(--diza-red)" />
                <span>Müşteri Şikayeti / Talep Açıklaması *</span>
              </label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Örn: 2 adet kamera çalışmıyor, gece görüntüsü yok veya sistem yedeklemesi yapılacak..."
                value={arizaTanimi}
                onChange={e => setArizaTanimi(e.target.value)}
                required
              />
            </div>

            {/* İsteğe Bağlı Ekstra Bilgiler (Teknisyen, Cihaz Modeli, Öncelik vb.) */}
            <div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', justifyContent: 'space-between', padding: '8px 12px' }}
                onClick={() => setShowExtra(!showExtra)}
              >
                <span style={{ fontSize: '12px' }}>
                  {showExtra ? '− Ekstra Bilgileri Gizle' : '+ Cihaz / Model, Teknisyen veya Öncelik Ekle (İsteğe Bağlı)'}
                </span>
                {showExtra ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showExtra && (
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
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label className="form-label">Cihaz / Sistem Modeli</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Örn: Hikvision 8 Kanal NVR"
                        value={cihazModel}
                        onChange={e => setCihazModel(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label">Seri No / Barkod</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="İsteğe bağlı"
                        value={seriNo}
                        onChange={e => setSeriNo(e.target.value)}
                      />
                    </div>
                  </div>

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
                      <label className="form-label">Öncelik</label>
                      <select
                        className="form-control"
                        value={oncelik}
                        onChange={e => setOncelik(e.target.value as any)}
                      >
                        <option value="Normal">Normal</option>
                        <option value="Acil">⚠️ Acil</option>
                        <option value="Kritik">🔥 Kritik</option>
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
                </div>
              )}
            </div>

          </div>

          {/* Modal Alt Butonları */}
          <div className="modal-footer" style={{ padding: '16px 20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Vazgeç
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 700, gap: '8px' }}
            >
              <Save size={18} />
              <span>SERVİS KAYDINI AÇ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
