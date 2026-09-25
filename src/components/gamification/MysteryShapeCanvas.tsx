'use client';

import React, { useEffect, useRef } from 'react';
import { Sparkles, Trophy, Lock, CheckCircle2 } from 'lucide-react';

interface MysteryShapeCanvasProps {
  currentStreakDays: number; // 0 to 30 days in the month
  totalMonthDays?: number;   // default 30
}

export const MysteryShapeCanvas: React.FC<MysteryShapeCanvasProps> = ({
  currentStreakDays,
  totalMonthDays = 30,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isMonthComplete = currentStreakDays >= totalMonthDays;
  const clampedDays = Math.min(currentStreakDays, totalMonthDays);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 480);
    const height = (canvas.height = 320);

    const cx = width / 2;
    const cy = height / 2;
    let t = 0;

    const render = () => {
      t += 0.025;
      ctx.clearRect(0, 0, width, height);

      // Light, elegant sacred parchment background
      const bgGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, width / 1.4);
      bgGrad.addColorStop(0, '#FEFDF8');
      bgGrad.addColorStop(0.7, '#FDF6E2');
      bgGrad.addColorStop(1, '#F3E8CB');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Delicate Orthodox decorative border
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(10, 10, width - 20, height - 20);
      ctx.strokeStyle = '#FDE68A';
      ctx.strokeRect(14, 14, width - 28, height - 28);

      // Sacred rays of divine light
      const rayAlpha = isMonthComplete ? 0.35 + Math.sin(t * 2) * 0.1 : 0.08;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.08);
      for (let i = 0; i < 16; i++) {
        ctx.beginPath();
        const angle = (i * Math.PI) / 8;
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * 180, Math.sin(angle) * 180);
        ctx.strokeStyle = `rgba(217, 119, 6, ${rayAlpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.restore();

      // 30 Mosaic Segments calculation (5 rows x 6 columns)
      const rows = 5;
      const cols = 6;
      const marginX = 26;
      const marginY = 26;
      const gridW = width - marginX * 2;
      const gridH = height - marginY * 2;
      const cellW = gridW / cols;
      const cellH = gridH / rows;

      // Draw the underlying authentic Coptic Orthodox Cross Icon
      ctx.save();
      // Clip region to revealed cells
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const index = r * cols + c + 1;
          if (index <= clampedDays) {
            ctx.rect(marginX + c * cellW, marginY + r * cellH, cellW, cellH);
          }
        }
      }
      ctx.clip();

      // --- AUTHENTIC COPTIC CROSS & HALO DRAWING ---
      // Radiant central halo
      const haloGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 95);
      haloGrad.addColorStop(0, '#FEF08A');
      haloGrad.addColorStop(0.5, '#FDE047');
      haloGrad.addColorStop(1, 'rgba(217, 119, 6, 0.2)');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 95, 0, Math.PI * 2);
      ctx.fill();

      // Halo gold rings
      ctx.strokeStyle = '#B45309';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, 90, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 78, 0, Math.PI * 2);
      ctx.stroke();

      // Coptic Cross Vertical Beam
      ctx.fillStyle = '#B45309';
      ctx.shadowColor = 'rgba(217, 119, 6, 0.4)';
      ctx.shadowBlur = 12;

      // Vertical shaft
      ctx.fillRect(cx - 14, cy - 90, 28, 180);
      // Horizontal shaft
      ctx.fillRect(cx - 75, cy - 14, 150, 28);

      // Gold inner inlay
      ctx.fillStyle = '#FBBF24';
      ctx.fillRect(cx - 8, cy - 82, 16, 164);
      ctx.fillRect(cx - 67, cy - 8, 134, 16);

      // Coptic Tri-lobed finials (أطراف الصليب القبطي الثلاثية المزخرفة)
      const drawCopticFinial = (x: number, y: number, radius: number) => {
        ctx.fillStyle = '#D97706';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
      };

      // Top trilobes
      drawCopticFinial(cx, cy - 98, 12);
      drawCopticFinial(cx - 16, cy - 94, 9);
      drawCopticFinial(cx + 16, cy - 94, 9);

      // Bottom trilobes
      drawCopticFinial(cx, cy + 98, 12);
      drawCopticFinial(cx - 16, cy + 94, 9);
      drawCopticFinial(cx + 16, cy + 94, 9);

      // Left trilobes
      drawCopticFinial(cx - 83, cy, 12);
      drawCopticFinial(cx - 79, cy - 16, 9);
      drawCopticFinial(cx - 79, cy + 16, 9);

      // Right trilobes
      drawCopticFinial(cx + 83, cy, 12);
      drawCopticFinial(cx + 79, cy - 16, 9);
      drawCopticFinial(cx + 79, cy + 16, 9);

      // Center sacred emblem & Dove of Peace
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Coptic Inscription (IC XC NIKA - يسوع المسيح يغلب)
      ctx.fillStyle = '#92400E';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ⲒⲤ ⲬⲤ', cx, cy - 40);
      ctx.fillText('ⲚⲒⲔⲀ', cx, cy + 50);

      // Cross center emblem (Holy Dove / Chi-Rho)
      ctx.fillStyle = '#B45309';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('☩', cx, cy + 5);

      ctx.restore();

      // Draw Mystery Grid overlay (revealed vs unrevealed mosaic tiles)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const index = r * cols + c + 1;
          const x = marginX + c * cellW;
          const y = marginY + r * cellH;

          if (index > clampedDays) {
            // Mystery unrevealed tile with golden parchment seal
            ctx.fillStyle = '#F3E8CB';
            ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);

            ctx.strokeStyle = '#E2D3B3';
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 1, y + 1, cellW - 2, cellH - 2);

            // Subtle day number watermark
            ctx.fillStyle = 'rgba(180, 83, 9, 0.25)';
            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${index}`, x + cellW / 2, y + cellH / 2);
          } else {
            // Revealed cell border with slight stained-glass shimmer
            ctx.strokeStyle = 'rgba(217, 119, 6, 0.4)';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, cellW, cellH);
          }
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [clampedDays, totalMonthDays, isMonthComplete]);

  return (
    <div className="overflow-hidden rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              أيقونة الشهر الأرثوذكسية (Mystery Orthodox Icon)
            </h3>
            <p className="text-xs text-slate-500">
              تكتمل اللوحة المقدسة بنهاية الـ 30 يوماً؛ كل يوم التزام يكشف قطعة فسيفساء من أيقونة الصليب المنير
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200">
          {isMonthComplete ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>اكتملت الأيقونة بالكامل! مبارك التزامك الشهري</span>
            </>
          ) : (
            <>
              <Lock className="h-3.5 w-3.5 text-amber-600" />
              <span>
                {clampedDays} من {totalMonthDays} يوماً مكشوفة
              </span>
            </>
          )}
        </div>
      </div>

      {/* Canvas Box */}
      <div className="relative flex justify-center items-center rounded-xl overflow-hidden border border-amber-100 bg-amber-50/30">
        <canvas
          ref={canvasRef}
          className="w-full max-w-xl h-64 sm:h-72 block cursor-pointer transition-transform"
        />

        {isMonthComplete && (
          <div className="absolute bottom-3 inset-x-4 rounded-xl bg-white/95 backdrop-blur-sm border border-amber-300 p-2.5 text-center shadow-md animate-fade-in flex items-center justify-center gap-2 text-xs font-bold text-amber-900">
            <Trophy className="h-4 w-4 text-amber-600" />
            <span>
              «كُنْتَ أَمِينًا فِي الْقَلِيلِ» — اكتملت أيقونة الصليب القبطي المنير والنور الإلهي بالكامل لشهر مبارك!
            </span>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>متبقي {Math.max(0, totalMonthDays - clampedDays)} يوماً لاكتمال الأيقونة بالكامل</span>
        <span className="font-semibold text-amber-700">
          نسبة الكشف: {Math.round((clampedDays / totalMonthDays) * 100)}%
        </span>
      </div>
    </div>
  );
};
