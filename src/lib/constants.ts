/**
 * Diza Teknik Servis — Gördit Bilgisayar
 * Copyright © 2024-2026 Gördit Bilgisayar — Zafer GÖRGÜN
 */

import type {
  DurumMeta,
  TeknikServisDurumu,
  FaaliyetAlani,
  IslemTuru,
  ServisTuru,
  TeklifDurumu,
} from '../types';

export const DURUMLAR: Record<TeknikServisDurumu, DurumMeta> = {
  KabulEdildi: {
    label: 'Kabul Edildi',
    badgeClass: 'badge-blue',
    color: '#0284c7',
    bgLight: 'rgba(2, 132, 199, 0.12)',
    icon: 'PackageCheck',
  },
  Incelemede: {
    label: 'İncelemede / Keşifte',
    badgeClass: 'badge-amber',
    color: '#d97706',
    bgLight: 'rgba(217, 119, 6, 0.12)',
    icon: 'Search',
  },
  OnayBekliyor: {
    label: 'Teklif / Onay Bekliyor',
    badgeClass: 'badge-orange',
    color: '#ea580c',
    bgLight: 'rgba(234, 88, 12, 0.12)',
    icon: 'ClockAlert',
  },
  ParcaBekliyor: {
    label: 'Parça / Ürün Bekliyor',
    badgeClass: 'badge-purple',
    color: '#9333ea',
    bgLight: 'rgba(147, 51, 234, 0.12)',
    icon: 'PackageOpen',
  },
  Tamirde: {
    label: 'Tamirde / Montajda',
    badgeClass: 'badge-cyan',
    color: '#0891b2',
    bgLight: 'rgba(8, 145, 178, 0.12)',
    icon: 'Wrench',
  },
  Tamamlandi: {
    label: 'Tamamlandı (Hazır / Devrede)',
    badgeClass: 'badge-emerald',
    color: '#059669',
    bgLight: 'rgba(5, 150, 105, 0.12)',
    icon: 'CheckCircle2',
  },
  TeslimEdildi: {
    label: 'Teslim / Montaj Bitti',
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
    color: '#e30613',
    bgLight: 'rgba(227, 6, 19, 0.12)',
    icon: 'XCircle',
  },
};

export const SERVIS_TURLERI: Record<ServisTuru, { label: string; icon: string; desc: string }> = {
  IcServis: {
    label: 'İç Servis (Atölye)',
    icon: 'Store',
    desc: 'Cihaz atölyeye/servis merkezimize teslim alındı',
  },
  DisServis: {
    label: 'Dış Servis (Saha / Montaj)',
    icon: 'Truck',
    desc: 'Müşteri yerinde keşif, montaj, kurulum veya yerinde arıza çözümü',
  },
};

export const FAALIYET_ALANLARI: Record<FaaliyetAlani, { label: string; icon: string; color: string; badge: string }> = {
  Bilgisayar: {
    label: 'Bilgisayar & Donanım & Sunucu',
    icon: 'Laptop',
    color: '#0284c7',
    badge: 'badge-blue',
  },
  GuvenlikKamerasi: {
    label: 'Güvenlik Kamerası (CCTV / IP)',
    icon: 'Video',
    color: '#059669',
    badge: 'badge-emerald',
  },
  AlarmSistemi: {
    label: 'Hırsız Alarm Sistemleri',
    icon: 'BellRing',
    color: '#e30613',
    badge: 'badge-red',
  },
  Yazilim: {
    label: 'Yazılım & Muhasebe & Otomasyon',
    icon: 'Code2',
    color: '#7c3aed',
    badge: 'badge-purple',
  },
  Network: {
    label: 'Network & Ağ & Kablolama',
    icon: 'Network',
    color: '#0891b2',
    badge: 'badge-cyan',
  },
  YanginAlarm: {
    label: 'Yangın Alarm & Algılama',
    icon: 'Flame',
    color: '#ea580c',
    badge: 'badge-orange',
  },
  Diger: {
    label: 'Diğer Hizmetler',
    icon: 'Layers',
    color: '#475569',
    badge: 'badge-slate',
  },
};

export const ISLEM_TURLERI: Record<IslemTuru, { label: string; icon: string }> = {
  ArizaCozum: { label: 'Arıza Çözümü & Onarım', icon: 'Wrench' },
  MontajKurulum: { label: 'Montaj & Kurulum & Devreye Alma', icon: 'Hammer' },
  Teklif: { label: 'Fiyat Teklifi Verme', icon: 'FileSpreadsheet' },
  KesifProje: { label: 'Yerinde Keşif & Projelendirme', icon: 'Compass' },
  PeriyodikBakim: { label: 'Sözleşmeli Periyodik Bakım', icon: 'RotateCw' },
};

export const TEKLIF_DURUMLARI: Record<TeklifDurumu, { label: string; color: string; badgeClass: string }> = {
  TeklifYok: { label: 'Teklif Yok', color: '#64748b', badgeClass: 'badge-slate' },
  Hazirlaniyor: { label: 'Teklif Hazırlanıyor', color: '#f59e0b', badgeClass: 'badge-amber' },
  Sunuldu: { label: 'Müşteriye Sunuldu', color: '#0284c7', badgeClass: 'badge-blue' },
  Onaylandi: { label: 'Teklif Onaylandı', color: '#10b981', badgeClass: 'badge-emerald' },
  Reddedildi: { label: 'Teklif Reddedildi', color: '#e30613', badgeClass: 'badge-red' },
};

export const CIHAZ_TIPLERI = [
  // Bilgisayar
  'Laptop / Dizüstü Bilgisayar',
  'Masaüstü Bilgisayar (PC)',
  'Sunucu / Server & Storage',
  'Monitör / All-in-One PC',
  'Yazıcı / Barkod Yazıcı / Tarayıcı',
  // Kamera
  'IP Kamera / Dome / Bullet',
  'AHD / Analog Güvenlik Kamerası',
  'NVR / DVR Kamera Kayıt Cihazı',
  'PTZ Speed Dome Hareketli Kamera',
  // Alarm
  'Hırsız Alarm Paneli',
  'Harici / Dahili Siren & Flaşör',
  'PIR Hareket Dedektörü & Manyetik Kontak',
  // Network
  'Yönetilebilir PoE Switch',
  'Router / Firewall / Modem',
  'Wi-Fi Access Point (Tavan / Dış Ortam)',
  'Rack Kabin / Patch Panel / PDU',
  // Yangın
  'Konvansiyonel / Adresli Yangın Paneli',
  'Optik Duman / Isı Dedektörü',
  'Yangın İhbar Butonu & Sireni',
  // Yazılım & Diğer
  'Ticari Ön Muhasebe / SQL Veritabanı',
  'Restoran / POS Otomasyon Sistemi',
  'Kesintisiz Güç Kaynağı (UPS)',
  'Diğer Sistem / Cihaz',
];

export const POPULER_MARKALAR = [
  'Dahua',
  'Hikvision',
  'Paradox',
  'DSC',
  'Ajax',
  'Ruijie / Reyee',
  'Ubiquiti / UniFi',
  'TP-Link / Omada',
  'Cisco',
  'HP / Aruba',
  'Dell',
  'Lenovo',
  'Asus',
  'Mavigard',
  'Finder',
  'ZKTeco',
  'Diza Yazılım',
  'Gördit Bilgisayar',
];

export const STANDART_AKSESUARLAR = [
  'Güç Adaptörü / Trafo',
  'Kamera Montaj Ayağı / Buat',
  'Uzaktan Kumanda / Keypad',
  'PoE Adaptör / Enjektör',
  'Patch Kablo / Ara Kablo',
  'Hard Disk (Kayıt Diski)',
  'Akü / Yedek Batarya',
  'Taşıma Çantası',
  'Yazılım Lisans Anahtarı',
];

export const STANDART_ARIZALAR = [
  'Kamera görüntüsü yok / Sinyal kesik',
  'Gece görüşü (IR LED) çalışmıyor / Karıncalı',
  'Kayıt cihazı açılmıyor / Bip bip ötüyor / HDD görmüyor',
  'Alarm sistemi sebepsiz yere ötüyor / Yanlış alarm veriyor',
  'Alarm paneli elektrik kesintisinde susuyor / Akü bitik',
  'Network internete çıkmıyor / IP dağıtmıyor',
  'Access Point Wi-Fi yayını yapmıyor / Kopmalar var',
  'Yangın dedektörü arıza / kirlilik uyarısı veriyor',
  'Yangın butonu basılı kaldı / Panel resetlenmiyor',
  'Bilgisayar açılmıyor / Mavi ekran / Format isteniyor',
  'SQL veri tabanı bağlantı hatası veriyor',
  'Yeni şube / işyeri için kamera & alarm keşfi ve montajı',
];

export const ON_HAZIR_FIZIKSEL_KONTROLLER = [
  { id: 'siviTemasi', label: 'Sıvı Teması / Nem / Oksitlenme' },
  { id: 'ekranKirik', label: 'Ekran / Lens / Cam Kırık' },
  { id: 'cizikVar', label: 'Kasa / Gövde Çizik & Yıpranmış' },
  { id: 'darbeVar', label: 'Düşme / Darbe / Kırık Ayak' },
  { id: 'acilmiyor', label: 'Cihaz / Panel Hiç Açılmıyor' },
  { id: 'sarjAlmiyor', label: 'Besleme / Adaptör Girişi Arızalı' },
  { id: 'asinIsinma', label: 'Aşırı Isınma / Fan Çalışmıyor' },
  { id: 'sesYok', label: 'Buzzer / Siren / Ses Çıkmıyor' },
  { id: 'kameraArizali', label: 'Sensör / Lens Arızası Var' },
];
