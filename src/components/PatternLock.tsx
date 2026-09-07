/**
 * Diza Teknik Servis — Gördit Bilgisayar
 * Copyright © 2024-2026 Gördit Bilgisayar — Zafer GÖRGÜN
 * 3x3 Dokunmatik Android Kilit Deseni Çizici ve Görüntüleyici
 */

import React, { useState, useRef, useEffect } from 'react';

interface PatternLockProps {
  value?: number[];
  onChange?: (pattern: number[]) => void;
  readonly?: boolean;
  size?: number;
}

export const PatternLock: React.FC<PatternLockProps> = ({
  value = [],
  onChange,
  readonly = false,
  size = 220,
}) => {
  const [pattern, setPattern] = useState<number[]>(value);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPos, setCurrentPos] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setPattern(value);
  }, [value]);

  // 3x3 Nokta Koordinatları (0'dan 8'e)
  const padding = size * 0.16;
  const step = (size - padding * 2) / 2;

  const points = [
    { id: 0, x: padding, y: padding },
    { id: 1, x: padding + step, y: padding },
    { id: 2, x: padding + step * 2, y: padding },
    { id: 3, x: padding, y: padding + step },
    { id: 4, x: padding + step, y: padding + step },
    { id: 5, x: padding + step * 2, y: padding + step },
    { id: 6, x: padding, y: padding + step * 2 },
    { id: 7, x: padding + step, y: padding + step * 2 },
    { id: 8, x: padding + step * 2, y: padding + step * 2 },
  ];

  const getSvgCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;
    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const findNearestPoint = (pos: { x: number; y: number }) => {
    const threshold = step * 0.45;
    for (const pt of points) {
      const dist = Math.hypot(pt.x - pos.x, pt.y - pos.y);
      if (dist < threshold) {
        return pt.id;
      }
    }
    return null;
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (readonly) return;
    setIsDrawing(true);
    const pos = getSvgCoordinates(e);
    if (!pos) return;
    const ptId = findNearestPoint(pos);
    if (ptId !== null) {
      const newPattern = [ptId];
      setPattern(newPattern);
      onChange?.(newPattern);
    } else {
      setPattern([]);
      onChange?.([]);
    }
    setCurrentPos(pos);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (readonly || !isDrawing) return;
    const pos = getSvgCoordinates(e);
    if (!pos) return;
    setCurrentPos(pos);

    const ptId = findNearestPoint(pos);
    if (ptId !== null && !pattern.includes(ptId)) {
      const newPattern = [...pattern, ptId];
      setPattern(newPattern);
      onChange?.(newPattern);
    }
  };

  const handleEnd = () => {
    if (readonly) return;
    setIsDrawing(false);
    setCurrentPos(null);
  };

  const clearPattern = () => {
    if (readonly) return;
    setPattern([]);
    onChange?.([]);
  };

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          background: 'rgba(15, 23, 42, 0.65)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          touchAction: 'none',
          userSelect: 'none',
          cursor: readonly ? 'default' : 'crosshair',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
        }}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        {/* Çizilen Çizgiler */}
        {pattern.map((ptId, index) => {
          if (index === 0) return null;
          const prevId = pattern[index - 1];
          const p1 = points[prevId];
          const p2 = points[ptId];
          return (
            <line
              key={`line-${index}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="#38bdf8"
              strokeWidth="4"
              strokeLinecap="round"
            />
          );
        })}

        {/* Aktif Fare/Dokunmatik İpucu Çizgisi */}
        {isDrawing && currentPos && pattern.length > 0 && (
          <line
            x1={points[pattern[pattern.length - 1]].x}
            y1={points[pattern[pattern.length - 1]].y}
            x2={currentPos.x}
            y2={currentPos.y}
            stroke="rgba(56, 189, 248, 0.6)"
            strokeWidth="3"
            strokeDasharray="4 4"
            strokeLinecap="round"
          />
        )}

        {/* 9 Adet Nokta */}
        {points.map(pt => {
          const isSelected = pattern.includes(pt.id);
          const isFirst = pattern[0] === pt.id;
          return (
            <g key={`pt-${pt.id}`}>
              {/* Dış Halka */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={size * 0.08}
                fill={isSelected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)'}
                stroke={isSelected ? '#38bdf8' : 'rgba(255, 255, 255, 0.2)'}
                strokeWidth={isSelected ? '2' : '1'}
              />
              {/* İç Dolgu Noktası */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={size * 0.035}
                fill={isFirst ? '#22c55e' : isSelected ? '#38bdf8' : 'rgba(255, 255, 255, 0.6)'}
              />
            </g>
          );
        })}
      </svg>

      {!readonly && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={clearPattern}
            style={{
              fontSize: '12px',
              padding: '4px 10px',
              borderRadius: '6px',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Deseni Temizle
          </button>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            {pattern.length > 0 ? `${pattern.length} nokta bağlı` : 'Noktaları birleştirin'}
          </span>
        </div>
      )}
    </div>
  );
};
