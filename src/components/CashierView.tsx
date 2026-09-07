/**
 * Diza Teknik Servis — Gördit Bilgisayar
 * Copyright © 2024-2026 Gördit Bilgisayar — Zafer GÖRGÜN
 * Kasa & Tahsilat Yönetimi
 */

import React, { useState } from 'react';
import {
  Receipt,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  CreditCard,
} from 'lucide-react';
import { useServices } from '../context/ServiceContext';
import { formatMoney, formatDateTime } from '../lib/format';
import type { OdemeTuru } from '../types';

export const CashierView: React.FC = () => {
  const { cashMoves, addCashMovement } = useServices();

  const [showAddModal, setShowAddModal] = useState(false);
  const [islemTuru, setIslemTuru] = useState<'Gelir' | 'Gider'>('Gelir');
  const [kategori, setKategori] = useState<any>('ServisTahsilat');
  const [aciklama, setAciklama] = useState('');
  const [tutar, setTutar] = useState<number>(0);
  const [odemeTuru, setOdemeTuru] = useState<OdemeTuru>('Nakit');

  const totalGelir = cashMoves.filter(c => c.islemTuru === 'Gelir').reduce((sum, c) => sum + c.tutar, 0);
  const totalGider = cashMoves.filter(c => c.islemTuru === 'Gider').reduce((sum, c) => sum + c.tutar, 0);
  const netKasa = totalGelir - totalGider;

  const kartTop = cashMoves.filter(c => c.islemTuru === 'Gelir' && c.odemeTuru === 'KrediKarti').reduce((s, c) => s + c.tutar, 0);

  const handleSaveMove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aciklama.trim() || !tutar) return;

    addCashMovement({
      islemTuru,
      kategori,
      aciklama,
      tutar: Number(tutar),
      odemeTuru,
    });

    setAciklama('');
    setTutar(0);
    setShowAddModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Üst Bilgi ve Buton */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Kasa & Tahsilat Defteri</h2>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
            Servis kapora, tamir tahsilatları ve işletme gider hareketleri
          </p>
        </div>

        <button type="button" className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Yeni Kasa Hareketi Ekle
        </button>
      </div>

      {/* KPI Kartları */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-box" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <ArrowDownLeft size={24} />
          </div>
          <div className="kpi-info">
            <h4>Toplam Gelir</h4>
            <div className="kpi-val" style={{ color: '#34d399' }}>{formatMoney(totalGelir)}</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
            <ArrowUpRight size={24} />
          </div>
          <div className="kpi-info">
            <h4>Toplam Gider</h4>
            <div className="kpi-val" style={{ color: '#f87171' }}>{formatMoney(totalGider)}</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box" style={{ background: 'rgba(2, 132, 199, 0.15)', color: '#38bdf8' }}>
            <Receipt size={24} />
          </div>
          <div className="kpi-info">
            <h4>Net Kasa Bakiyesi</h4>
            <div className="kpi-val" style={{ color: '#38bdf8' }}>{formatMoney(netKasa)}</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <CreditCard size={24} />
          </div>
          <div className="kpi-info">
            <h4>Kredi Kartı / POS</h4>
            <div className="kpi-val" style={{ fontSize: '18px' }}>{formatMoney(kartTop)}</div>
          </div>
        </div>
      </div>

      {/* Hareketler Tablosu */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', fontWeight: 700, fontSize: '15px' }}>
          Kasa Hareket Geçmişi
        </div>

        <div className="data-table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Tarih</th>
                <th>İşlem Türü</th>
                <th>Kategori</th>
                <th>Açıklama</th>
                <th>Ödeme Türü</th>
                <th style={{ textAlign: 'right' }}>Tutar</th>
              </tr>
            </thead>
            <tbody>
              {cashMoves.map(item => {
                const isGelir = item.islemTuru === 'Gelir';
                return (
                  <tr key={item.id}>
                    <td style={{ color: '#94a3b8', fontSize: '12px' }}>{formatDateTime(item.tarih)}</td>
                    <td>
                      <span className={`badge ${isGelir ? 'badge-emerald' : 'badge-red'}`} style={{ fontSize: '11px' }}>
                        {isGelir ? '+ Gelir' : '- Gider'}
                      </span>
                    </td>
                    <td style={{ color: '#cbd5e1' }}>{item.kategori}</td>
                    <td style={{ fontWeight: 600 }}>{item.aciklama}</td>
                    <td>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>{item.odemeTuru}</span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 800, fontSize: '14px', color: isGelir ? '#34d399' : '#f87171' }}>
                      {isGelir ? '+' : '-'}{formatMoney(item.tutar)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manuel Kasa Hareketi Ekleme Modalı */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Kasa Gelir / Gider Ekle</h3>
              <button type="button" className="btn btn-secondary btn-icon" onClick={() => setShowAddModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSaveMove}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">İşlem Yönü</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                      type="button"
                      className={`btn ${islemTuru === 'Gelir' ? 'btn-success' : 'btn-secondary'}`}
                      onClick={() => setIslemTuru('Gelir')}
                    >
                      + Gelir (Tahsilat)
                    </button>
                    <button
                      type="button"
                      className={`btn ${islemTuru === 'Gider' ? 'btn-danger' : 'btn-secondary'}`}
                      onClick={() => setIslemTuru('Gider')}
                    >
                      - Gider (Ödeme)
                    </button>
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Kategori</label>
                  <select className="form-control" value={kategori} onChange={e => setKategori(e.target.value)}>
                    <option value="ServisTahsilat">Servis Tahsilatı</option>
                    <option value="Kapora">Kapora</option>
                    <option value="ParcaAlisi">Yedek Parça Alımı</option>
                    <option value="GenelGider">İşletme Gideri (Kira, Fatura, Çay vb.)</option>
                    <option value="Diger">Diğer</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Açıklama *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Örn: Müşteri tamir ücreti veya kargo ödemesi"
                    value={aciklama}
                    onChange={e => setAciklama(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Tutar (TL) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      step="10"
                      className="form-control"
                      value={tutar || ''}
                      onChange={e => setTutar(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Ödeme Kanalı</label>
                    <select className="form-control" value={odemeTuru} onChange={e => setOdemeTuru(e.target.value as OdemeTuru)}>
                      <option value="Nakit">Nakit Kasa</option>
                      <option value="KrediKarti">POS / Kredi Kartı</option>
                      <option value="HavaleEFT">Banka Havale / EFT</option>
                    </select>
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
