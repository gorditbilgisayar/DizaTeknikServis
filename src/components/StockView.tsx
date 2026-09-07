/**
 * Diza Teknik Servis — Gördit Bilgisayar
 * Copyright © 2024-2026 Gördit Bilgisayar — Zafer GÖRGÜN
 * Yedek Parça & Sarf Malzeme Stok Yönetimi
 */

import React, { useState } from 'react';
import {
  Plus,
  AlertTriangle,
} from 'lucide-react';
import { useServices } from '../context/ServiceContext';
import { formatMoney } from '../lib/format';

export const StockView: React.FC = () => {
  const { stockParts, addStockPart, updateStockPart } = useServices();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Yeni Parça Formu
  const [kod, setKod] = useState('');
  const [ad, setAd] = useState('');
  const [kategori, setKategori] = useState('Ekran');
  const [stokAdedi, setStokAdedi] = useState(5);
  const [kritikStok, setKritikStok] = useState(2);
  const [alisFiyati, setAlisFiyati] = useState(0);
  const [satisFiyati, setSatisFiyati] = useState(0);

  const filtered = stockParts.filter(p =>
    p.ad.toLowerCase().includes(search.toLowerCase()) ||
    p.kod.toLowerCase().includes(search.toLowerCase()) ||
    p.kategori.toLowerCase().includes(search.toLowerCase())
  );

  const criticalCount = stockParts.filter(p => p.stokAdedi <= p.kritikStok).length;

  const handleSavePart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ad.trim()) return;

    addStockPart({
      kod: kod.trim() || `PRC-${Date.now().toString().slice(-4)}`,
      ad,
      kategori,
      stokAdedi: Number(stokAdedi) || 0,
      kritikStok: Number(kritikStok) || 2,
      alisFiyati: Number(alisFiyati) || 0,
      satisFiyati: Number(satisFiyati) || 0,
      kdvOrani: 20,
    });

    setAd('');
    setKod('');
    setAlisFiyati(0);
    setSatisFiyati(0);
    setShowAddModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Yedek Parça & Sarf Malzeme</h2>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
            Servis tamirlerinde kullanılan parçaların stok adedi ve fiyat takibi
          </p>
        </div>

        <button type="button" className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Yeni Parça Tanımla
        </button>
      </div>

      {/* Kritik Stok Uyarısı Banner'ı (Varsa) */}
      {criticalCount > 0 && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)', borderRadius: '12px', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertTriangle size={22} color="#f87171" />
          <div style={{ fontSize: '13px', color: '#f87171' }}>
            <strong>Dikkat:</strong> {criticalCount} adet parçanın stoğu kritik seviyenin altındadır! Sipariş vermeniz önerilir.
          </div>
        </div>
      )}

      {/* Arama ve Filtre */}
      <div className="glass-card" style={{ padding: '12px 18px' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Parça adı, stok kodu veya kategori ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Parçalar Tablosu */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="data-table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Kod</th>
                <th>Parça Tanımı</th>
                <th>Kategori</th>
                <th>Stok Adedi</th>
                <th>Alış Fiyatı</th>
                <th>Satış Fiyatı</th>
                <th>Durum</th>
                <th style={{ textAlign: 'right' }}>Hızlı Stok</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const isCritical = p.stokAdedi <= p.kritikStok;
                return (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 700, color: '#38bdf8' }}>{p.kod}</td>
                    <td style={{ fontWeight: 600, color: '#fff' }}>{p.ad}</td>
                    <td>
                      <span className="badge badge-blue" style={{ fontSize: '10px' }}>{p.kategori}</span>
                    </td>
                    <td style={{ fontWeight: 800, fontSize: '15px', color: isCritical ? '#f87171' : '#fff' }}>
                      {p.stokAdedi} adet
                    </td>
                    <td style={{ color: '#94a3b8' }}>{formatMoney(p.alisFiyati)}</td>
                    <td style={{ fontWeight: 700, color: '#34d399' }}>{formatMoney(p.satisFiyati)}</td>
                    <td>
                      <span className={`badge ${isCritical ? 'badge-red' : 'badge-emerald'}`} style={{ fontSize: '10px' }}>
                        {isCritical ? 'Kritik Stok' : 'Yeterli'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '4px' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ width: '28px', height: '28px', padding: 0 }}
                          onClick={() => updateStockPart(p.id, { stokAdedi: Math.max(0, p.stokAdedi - 1) })}
                          title="1 Azalt"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ width: '28px', height: '28px', padding: 0 }}
                          onClick={() => updateStockPart(p.id, { stokAdedi: p.stokAdedi + 1 })}
                          title="1 Ekle"
                        >
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Yeni Parça Modalı */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Yeni Yedek Parça Ekle</h3>
              <button type="button" className="btn btn-secondary btn-icon" onClick={() => setShowAddModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSavePart}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Stok Kodu</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Örn: PRC-SSD-01"
                      value={kod}
                      onChange={e => setKod(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Kategori</label>
                    <select className="form-control" value={kategori} onChange={e => setKategori(e.target.value)}>
                      <option value="Ekran">Ekran / Panel</option>
                      <option value="Batarya">Batarya / Pil</option>
                      <option value="Depolama">SSD / HDD</option>
                      <option value="Bellek">RAM Bellek</option>
                      <option value="Klavye">Klavye</option>
                      <option value="Sarf Malzeme">Sarf Malzeme / Macun</option>
                      <option value="Soket">Şarj Soketi</option>
                      <option value="Diger">Diğer</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Parça Adı / Tanımı *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Örn: 15.6 Full HD Slim 30 Pin Ekran"
                    value={ad}
                    onChange={e => setAd(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Stok Adedi</label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={stokAdedi}
                      onChange={e => setStokAdedi(parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Kritik Stok Uyarısı</label>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      value={kritikStok}
                      onChange={e => setKritikStok(parseInt(e.target.value) || 2)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Alış Fiyatı (TL)</label>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      className="form-control"
                      value={alisFiyati || ''}
                      onChange={e => setAlisFiyati(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Satış Fiyatı (TL)</label>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      className="form-control"
                      value={satisFiyati || ''}
                      onChange={e => setSatisFiyati(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Vazgeç
                </button>
                <button type="submit" className="btn btn-primary">
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
