/**
 * Diza Teknik Servis — Gördit Bilgisayar
 * Copyright © 2024-2026 Gördit Bilgisayar — Zafer GÖRGÜN
 * Firma Ayarları, Çıktı Şartnamesi ve Veri Yedekleme
 */

import React, { useState } from 'react';
import {
  Building,
  FileText,
  Download,
  Upload,
  RefreshCw,
  Save,
  ShieldCheck,
} from 'lucide-react';
import { useServices } from '../context/ServiceContext';
import { formatPhoneNumber } from '../lib/format';

export const SettingsView: React.FC = () => {
  const {
    companySettings,
    updateCompanySettings,
    exportDatabaseJson,
    importDatabaseJson,
    resetToSampleData,
  } = useServices();

  const [settings, setSettings] = useState(companySettings);

  const handlePhoneChange = (key: 'telefon' | 'gsm', val: string) => {
    setSettings(prev => ({ ...prev, [key]: formatPhoneNumber(val) }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanySettings(settings);
    alert('Firma ve servis ayarları başarıyla kaydedildi.');
  };

  const handleExportBackup = () => {
    const jsonStr = exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diza_teknik_servis_yedek_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const ok = importDatabaseJson(reader.result);
        if (ok) {
          alert('Yedek başarıyla geri yüklendi!');
          window.location.reload();
        } else {
          alert('Yedek dosyası formatı geçersiz!');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Sistem Ayarları & Yedekleme</h2>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
            Firma antet bilgileri, kurumsal telefon formatı ve veritabanı yedekleme
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Firma Kimlik Kartı */}
        <div className="glass-card">
          <h3 style={{ fontSize: '15px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Building size={18} /> Firma & Telif Bilgileri
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Firma / Servis Adı</label>
              <input
                type="text"
                className="form-control"
                value={settings.firmaAdi}
                onChange={e => setSettings({ ...settings, firmaAdi: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Resmi Ünvan & Geliştirici</label>
              <input
                type="text"
                className="form-control"
                value={settings.resmiUnvan}
                onChange={e => setSettings({ ...settings, resmiUnvan: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Sabit Telefon (0XXX XXX XX XX)</label>
              <input
                type="tel"
                className="form-control"
                value={settings.telefon}
                onChange={e => handlePhoneChange('telefon', e.target.value)}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">GSM / WhatsApp (0XXX XXX XX XX)</label>
              <input
                type="tel"
                className="form-control"
                value={settings.gsm}
                onChange={e => handlePhoneChange('gsm', e.target.value)}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">E-Posta Adresi</label>
              <input
                type="email"
                className="form-control"
                value={settings.email}
                onChange={e => setSettings({ ...settings, email: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Adres / Şehir</label>
              <input
                type="text"
                className="form-control"
                value={settings.adres}
                onChange={e => setSettings({ ...settings, adres: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Yazdırma ve Garanti Şartnamesi */}
        <div className="glass-card">
          <h3 style={{ fontSize: '15px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <FileText size={18} /> Servis Çıktısı Şartnamesi (A4 ve Termal)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">A4 Form Şartnamesi & Maddeleri</label>
              <textarea
                className="form-control"
                rows={6}
                value={settings.servisSartlariA4}
                onChange={e => setSettings({ ...settings, servisSartlariA4: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">80mm Termal POS Fişi Alt Notu</label>
              <textarea
                className="form-control"
                rows={6}
                value={settings.termalSartlar}
                onChange={e => setSettings({ ...settings, termalSartlar: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button type="submit" className="btn btn-primary">
              <Save size={18} /> Ayarları Kaydet
            </button>
          </div>
        </div>
      </form>

      {/* Veri Yedekleme & Geri Yükleme */}
      <div className="glass-card">
        <h3 style={{ fontSize: '15px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <ShieldCheck size={18} /> Veri Güvenliği & JSON Yedekleme
        </h3>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>
          Tüm servis kayıtlarını, teknisyenleri, stok parçalarını ve kasa hareketlerini tek tıkla bilgisayarınıza indirebilir, dilediğiniz zaman geri yükleyebilirsiniz.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <button type="button" className="btn btn-primary" onClick={handleExportBackup}>
            <Download size={16} /> Veritabanını İndir (JSON Yedek)
          </button>

          <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
            <Upload size={16} /> Yedekten Geri Yükle
            <input
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleImportBackup}
            />
          </label>

          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => {
              if (confirm('Tüm verileri başlangıçtaki örnek verilere sıfırlamak istediğinize emin misiniz?')) {
                resetToSampleData();
                alert('Veriler başlangıç ayarlarına sıfırlandı.');
                window.location.reload();
              }
            }}
          >
            <RefreshCw size={14} /> Örnek Verilere Sıfırla
          </button>
        </div>
      </div>
    </div>
  );
};
