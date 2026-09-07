/**
 * Diza Teknik Servis — Gördit Bilgisayar
 * Copyright © 2024-2026 Gördit Bilgisayar — Zafer GÖRGÜN
 * Tüm hakları saklıdır.
 */

export type TeknikServisDurumu =
  | 'KabulEdildi'
  | 'Incelemede'
  | 'OnayBekliyor'
  | 'ParcaBekliyor'
  | 'Tamirde'
  | 'Tamamlandi'
  | 'TeslimEdildi'
  | 'IptalIade'
  | 'OdemesiBekliyor';

export interface DurumMeta {
  label: string;
  badgeClass: string;
  color: string;
  bgLight: string;
  icon: string;
}

export type OdemeTuru = 'Nakit' | 'KrediKarti' | 'HavaleEFT';

export interface ServisSatiri {
  id: string;
  tur: 'Parca' | 'Iscilik' | 'Diger';
  tanim: string;
  adet: number;
  birimFiyat: number;
  kdvOrani: number; // %0, %10, %20
  toplamTutar: number;
}

export interface CihazHasarNoktasi {
  id: string;
  x: number;
  y: number;
  not: string;
}

export interface TeknikServisItem {
  id: string;
  servisNo: string; // TS-2026-0001
  musteriAdSoyad: string;
  musteriTelefon: string; // 0(XXX) XXX XX XX
  musteriEmail?: string;
  musteriAdres?: string;
  musteriTcVergiNo?: string;

  cihazTipi: string; // Laptop, PC, Tablet, Telefon vs.
  markaModel: string;
  seriNoImei: string;
  cihazSifresi?: string;
  kilitDeseni?: number[]; // [0,1,2,4,6] 3x3 kilit deseni nokta indeksleri

  aksesuarlar: string[]; // ['Orijinal Adaptör', 'Çanta', 'Kablo']
  aksesuarDiger?: string;

  // Fiziksel Kontroller
  siviTemasi: boolean;
  ekranKirik: boolean;
  cizikVar: boolean;
  darbeVar: boolean;
  acilmiyor: boolean;
  sarjAlmiyor: boolean;
  asinIsinma: boolean;
  sesYok: boolean;
  kameraArizali: boolean;
  fizikselDurumNotu?: string;

  arizaTanimi: string; // Müşteri Şikayeti
  teknisyenTespit?: string; // Ön inceleme
  yapilanIslemler?: string;

  fotograflar: string[]; // base64 / blob urls

  durum: TeknikServisDurumu;
  atananTeknisyenId?: string;
  atananTeknisyenAd?: string;

  gelisTarihi: string; // ISO string
  tahminiTeslimTarihi?: string;
  tamamlanmaTarihi?: string;
  teslimTarihi?: string;

  // Finansal Bilgiler
  satirlar: ServisSatiri[];
  iscilikUcreti: number;
  parcaUcreti: number;
  kdvTutari: number;
  indirimTutari: number;
  toplamTutar: number;
  alinanKapora: number;
  kalanTutar: number;
  odemeTuru?: OdemeTuru;
  tahsilEdildi: boolean;

  garantiKapsaminda: boolean;
  garantiSuresiAy: number;

  oncelik: 'Normal' | 'Acil' | 'Kritik';
  dahiliNotlar?: string;
}

export interface StokParca {
  id: string;
  kod: string;
  ad: string;
  kategori: string;
  stokAdedi: number;
  kritikStok: number;
  alisFiyati: number;
  satisFiyati: number;
  kdvOrani: number;
}

export interface Teknisyen {
  id: string;
  adSoyad: string;
  telefon: string;
  uzmanlik: string;
  aktif: boolean;
}

export interface KasaHareketi {
  id: string;
  tarih: string;
  islemTuru: 'Gelir' | 'Gider';
  kategori: 'ServisTahsilat' | 'Kapora' | 'ParcaAlisi' | 'GenelGider' | 'Diger';
  aciklama: string;
  tutar: number;
  odemeTuru: OdemeTuru;
  servisId?: string;
  servisNo?: string;
}

export interface FirmaAyarlari {
  firmaAdi: string;
  resmiUnvan: string;
  telefon: string;
  gsm: string;
  email: string;
  adres: string;
  vergiDairesi: string;
  vergiNo: string;
  webSitesi: string;
  servisSartlariA4: string;
  termalSartlar: string;
  servisNoOnEk: string;
  sonServisNo: number;
}
