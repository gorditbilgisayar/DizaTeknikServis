/**
 * Diza Teknik Servis — Gördit Bilgisayar
 * Copyright © 2024-2026 Gördit Bilgisayar — Zafer GÖRGÜN
 */

import type { DurumMeta, TeknikServisDurumu } from '../types';

export const DURUMLAR: Record<TeknikServisDurumu, DurumMeta> = {
  KabulEdildi: {
    label: 'Kabul Edildi',
    badgeClass: 'badge-blue',
    color: '#2563eb',
    bgLight: 'rgba(37, 99, 235, 0.12)',
    icon: 'PackageCheck',
  },
  Incelemede: {
    label: 'İncelemede',
    badgeClass: 'badge-amber',
    color: '#d97706',
    bgLight: 'rgba(217, 119, 6, 0.12)',
    icon: 'Search',
  },
  OnayBekliyor: {
    label: 'Onay Bekliyor',
    badgeClass: 'badge-orange',
    color: '#ea580c',
    bgLight: 'rgba(234, 88, 12, 0.12)',
    icon: 'ClockAlert',
  },
  ParcaBekliyor: {
    label: 'Parça Bekliyor',
    badgeClass: 'badge-purple',
    color: '#9333ea',
    bgLight: 'rgba(147, 51, 234, 0.12)',
    icon: 'PackageOpen',
  },
  Tamirde: {
    label: 'Tamirde / İşlemde',
    badgeClass: 'badge-cyan',
    color: '#0891b2',
    bgLight: 'rgba(8, 145, 178, 0.12)',
    icon: 'Wrench',
  },
  Tamamlandi: {
    label: 'Tamamlandı (Hazır)',
    badgeClass: 'badge-emerald',
    color: '#059669',
    bgLight: 'rgba(5, 150, 105, 0.12)',
    icon: 'CheckCircle2',
  },
  TeslimEdildi: {
    label: 'Teslim Edildi',
    badgeClass: 'badge-slate',
    color: '#475569',
    bgLight: 'rgba(71, 85, 105, 0.12)',
    icon: 'UserCheck',
  },
  OdemesiBekliyor: {
    label: 'Ödemesi Bekliyor',
    badgeClass: 'badge-rose',
    color: '#e11d48',
    bgLight: 'rgba(225, 29, 72, 0.12)',
    icon: 'Receipt',
  },
  IptalIade: {
    label: 'İptal / İade',
    badgeClass: 'badge-red',
    color: '#dc2626',
    bgLight: 'rgba(220, 38, 38, 0.12)',
    icon: 'XCircle',
  },
};

export const CIHAZ_TIPLERI = [
  'Laptop / Dizüstü Bilgisayar',
  'Masaüstü Bilgisayar (Kasa)',
  'Monitör / All-in-One PC',
  'Akıllı Telefon / Cep Telefonu',
  'Tablet',
  'Yazıcı / Tarayıcı / Fotokopi',
  'Oyun Konsolu (PlayStation / Xbox)',
  'Anakart / Ekran Kartı (Bileşen)',
  'Güç Kaynağı / UPS',
  'Ağ Cihazı / Modem / Router',
  'Harici Disk / Veri Kurtarma',
  'Diğer Elektronik Cihaz',
];

export const POPULER_MARKALAR = [
  'Apple',
  'Asus',
  'Lenovo',
  'HP',
  'Dell',
  'Acer',
  'Samsung',
  'Xiaomi',
  'Huawei',
  'Monster',
  'MSI',
  'Canon',
  'Epson',
  'Sony',
  'LG',
  'Casper',
  'Diğer Marka',
];

export const STANDART_AKSESUARLAR = [
  'Orijinal Şarj Adaptörü',
  'Güç Kablosu',
  'Taşıma Çantası',
  'Kablosuz Mouse / Fare',
  'SIM Kart',
  'Hafıza Kartı (SD)',
  'USB Dongle / Alıcı',
  'Orijinal Kutusu',
  'Ekran Koruyucu / Kılıf',
  'Batarya / Pil',
];

export const STANDART_ARIZALAR = [
  'Cihaz hiç açılmıyor / Güç yok',
  'Ekrana görüntü gelmiyor',
  'Ekran kırık / Dokunmatik çalışmıyor',
  'Şarj almıyor / Soket temassızlık yapıyor',
  'Cihaza sıvı döküldü / Sıvı teması',
  'Aşırı ısınıyor ve kendiliğinden kapanıyor',
  'Çok yavaş çalışıyor / Format ve bakım isteniyor',
  'Mavi ekran hatası veriyor / Windows açılmıyor',
  'Klavye bazı tuşlar basmıyor / Sıvı hasarlı',
  'Hoparlörden ses çıkmıyor / Mikrofon çalışmıyor',
  'Wi-Fi / İnternet bağlantısı kopuyor',
  'Veri kurtarma talep ediliyor',
];

export const ON_HAZIR_FIZIKSEL_KONTROLLER = [
  { id: 'siviTemasi', label: 'Sıvı Teması Var' },
  { id: 'ekranKirik', label: 'Ekran Kırık / Çatlak' },
  { id: 'cizikVar', label: 'Kasa / Kapak Çizik' },
  { id: 'darbeVar', label: 'Darbe / Ezik / Kırık Köşe' },
  { id: 'acilmiyor', label: 'Cihaz Açılmıyor' },
  { id: 'sarjAlmiyor', label: 'Şarj Almıyor' },
  { id: 'asinIsinma', label: 'Aşırı Isınma Var' },
  { id: 'sesYok', label: 'Ses / Hoparlör Bozuk' },
  { id: 'kameraArizali', label: 'Kamera Arızalı' },
];
