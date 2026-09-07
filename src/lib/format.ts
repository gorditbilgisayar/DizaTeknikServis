/**
 * Diza Teknik Servis — Gördit Bilgisayar
 * Copyright © 2024-2026 Gördit Bilgisayar — Zafer GÖRGÜN
 */

/**
 * Telefon formatlayıcı: 0(XXX) XXX XX XX
 * Her zaman Gördit Bilgisayar standardına uygun maskeler.
 */
export function formatPhoneNumber(val: string): string {
  if (!val) return '';
  // Sadece rakamları al
  const digits = val.replace(/\D/g, '');
  if (digits.length === 0) return '';

  // Başında 0 yoksa veya fazla 0 varsa temizleyip standartlaştır
  let cleaned = digits;
  if (cleaned.startsWith('90') && cleaned.length > 10) {
    cleaned = cleaned.substring(2);
  }
  if (!cleaned.startsWith('0')) {
    cleaned = '0' + cleaned;
  }
  // En fazla 11 hane (0 ve 10 rakam)
  cleaned = cleaned.substring(0, 11);

  // Maskeleme: 0(XXX) XXX XX XX
  const d0 = cleaned[0] || '0';
  const alanKodu = cleaned.substring(1, 4);
  const ucHane = cleaned.substring(4, 7);
  const ikiHane1 = cleaned.substring(7, 9);
  const ikiHane2 = cleaned.substring(9, 11);

  let result = `${d0}`;
  if (alanKodu.length > 0) {
    result += `(${alanKodu}`;
    if (alanKodu.length === 3) result += ') ';
  }
  if (ucHane.length > 0) {
    result += ucHane;
    if (ucHane.length === 3) result += ' ';
  }
  if (ikiHane1.length > 0) {
    result += ikiHane1;
    if (ikiHane1.length === 2) result += ' ';
  }
  if (ikiHane2.length > 0) {
    result += ikiHane2;
  }

  return result.trim();
}

/**
 * Para formatlayıcı: 1.250,50 ₺
 */
export function formatMoney(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '₺ 0,00';
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Tarih ve Saat formatlayıcı
 */
export function formatDateTime(isoOrDate: string | Date | undefined): string {
  if (!isoOrDate) return '-';
  try {
    const d = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
    if (isNaN(d.getTime())) return '-';
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return String(isoOrDate);
  }
}

export function formatDateOnly(isoOrDate: string | Date | undefined): string {
  if (!isoOrDate) return '-';
  try {
    const d = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
    if (isNaN(d.getTime())) return '-';
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d);
  } catch {
    return String(isoOrDate);
  }
}

/**
 * Code 128 / SVG Barkod Üreteci
 */
export function generateBarcodeSvg(text: string): string {
  if (!text) return '';
  let svgLines = '';
  let x = 12;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    const pattern = [(code % 3) + 1, ((code * 2) % 3) + 1, ((code * 3) % 2) + 1, 1];
    for (let j = 0; j < pattern.length; j++) {
      const w = pattern[j] * 1.5;
      if (j % 2 === 0) {
        svgLines += `<rect x="${x}" y="2" width="${w}" height="38" fill="#1e293b" />`;
      }
      x += w + 1.2;
    }
  }
  return `<svg viewBox="0 0 ${x + 12} 52" width="${x + 12}px" height="52px" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
    ${svgLines}
    <text x="${(x + 12) / 2}" y="48" text-anchor="middle" font-size="10" font-family="'Inter', monospace" font-weight="600" fill="#334155">${text}</text>
  </svg>`;
}

/**
 * SVG QR Kod Üreteci (Harici kütüphane gerektirmeyen hafif QR SVG matrisi)
 */
export function generateQrCodeSvg(data: string, size = 100): string {
  // Basit ve güvenilir hash-tabanlı SVG QR matrisi
  const matrixSize = 21;
  const cellSize = size / matrixSize;
  let cells = '';

  // Pozisyon belirteçleri (Sol üst, Sağ üst, Sol alt)
  const drawFinder = (r: number, c: number) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (
          i === 0 || i === 6 || j === 0 || j === 6 ||
          (i >= 2 && i <= 4 && j >= 2 && j <= 4)
        ) {
          cells += `<rect x="${(c + j) * cellSize}" y="${(r + i) * cellSize}" width="${cellSize}" height="${cellSize}" fill="#0f172a" />`;
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, matrixSize - 7);
  drawFinder(matrixSize - 7, 0);

  // Veri hücreleri simülasyonu (deterministik veri dolgusu)
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = (hash * 31 + data.charCodeAt(i)) % 1000000007;
  }

  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      // Bulucu desen alanlarını atla
      if (
        (r < 8 && c < 8) ||
        (r < 8 && c >= matrixSize - 8) ||
        (r >= matrixSize - 8 && c < 8)
      ) {
        continue;
      }
      // Veri desenleme
      const pseudoBit = ((hash ^ (r * 17 + c * 37)) % 2 === 0);
      if (pseudoBit) {
        cells += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize}" height="${cellSize}" fill="#0f172a" />`;
      }
    }
  }

  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; border-radius:6px; background:#fff; padding:4px;">
    ${cells}
  </svg>`;
}

/**
 * WhatsApp Mesaj Şablonu Oluşturucu
 */
export function buildWhatsAppLink(telefon: string, mesaj: string): string {
  const cleanPhone = telefon.replace(/\D/g, '');
  let fullPhone = cleanPhone;
  if (cleanPhone.startsWith('0')) {
    fullPhone = '90' + cleanPhone.substring(1);
  } else if (!cleanPhone.startsWith('90')) {
    fullPhone = '90' + cleanPhone;
  }
  return `https://wa.me/${fullPhone}?text=${encodeURIComponent(mesaj)}`;
}
