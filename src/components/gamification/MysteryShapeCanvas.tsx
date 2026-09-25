'use client';

import React, { useEffect, useRef } from 'react';
import { Sparkles, Eye, Lock, CheckCircle2 } from 'lucide-react';

interface MysteryShapeCanvasProps {
  completedCount: number; // 0 to 4
  totalTarget: number;    // 4
  shapeUnlocked: boolean;
}

export const MysteryShapeCanvas: React.FC<MysteryShapeCanvasProps> = ({
  completedCount,
  totalTarget,
  shapeUnlocked,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 360);
    const height = (canvas.height = 240);

    const centerX = width / 2;
    const centerY = height / 2;

    // Cross and sacred halo points normalized to center
    const crossPoints = [
      { x: centerX, y: centerY - 65 }, // Top
      { x: centerX, y: centerY + 65 }, // Bottom
      { x: centerX - 50, y: centerY - 15 }, // Left
      { x: centerX + 50, y: centerY - 15 }, // Right
      // Coptic Cross ornaments (trilobed ends)
      { x: centerX - 12, y: centerY - 65 },
      { x: centerX + 12, y: centerY - 65 },
      { x: centerX - 12, y: centerY + 65 },
      { x: centerX + 12, y: centerY + 65 },
      { x: centerX - 50, y: centerY - 27 },
      { x: centerX - 50, y: centerY - 3 },
      { x: centerX + 50, y: centerY - 27 },
      { x: centerX + 50, y: centerY - 3 },
      // Central sunburst circle points
      { x: centerX - 20, y: centerY - 35 },
      { x: centerX + 20, y: centerY - 35 },
      { x: centerX - 20, y: centerY + 5 },
      { x: centerX + 20, y: centerY + 5 },
    ];

    let t = 0;

    const render = () => {
      t += 0.03;
      ctx.clearRect(0, 0, width, height);

      // Deep celestial spiritual background gradient
      const bgGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        width / 1.5
      );
      bgGrad.addColorStop(0, '#1E1B4B');
      bgGrad.addColorStop(1, '#0B0F19');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Ambient background stardust
      for (let i = 0; i < 30; i++) {
        const starX = (Math.sin(i * 99 + t * 0.1) * 0.5 + 0.5) * width;
        const starY = (Math.cos(i * 33 + t * 0.1) * 0.5 + 0.5) * height;
        const alpha = Math.abs(Math.sin(t + i)) * 0.4 + 0.1;
        ctx.fillStyle = `rgba(212, 175, 55, ${alpha})`;
        ctx.beginPath();
        ctx.arc(starX, starY, (i % 3) + 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      if (completedCount === 0) {
        // Mysterious Empty Canvas with subtle question mark pulse
        ctx.fillStyle = 'rgba(212, 175, 55, 0.25)';
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('؟', centerX, centerY);
        return;
      }

      // Draw revealed points according to completed count
      const revealFraction = Math.min(completedCount / totalTarget, 1);
      const pointsToDraw = Math.floor(crossPoints.length * revealFraction);

      // Connect points with glowing spiritual strings
      ctx.lineWidth = 2;
      ctx.strokeStyle = shapeUnlocked
        ? `rgba(245, 158, 11, ${0.7 + Math.sin(t * 2) * 0.2})`
        : 'rgba(212, 175, 55, 0.4)';

      ctx.beginPath();
      for (let i = 0; i < pointsToDraw; i++) {
        const pt = crossPoints[i];
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();

      // If fully unlocked (4/4), draw the glowing Coptic Cross with divine rays
      if (shapeUnlocked) {
        // Divine radiance rays
        ctx.save();
        ctx.translate(centerX, centerY - 15);
        ctx.rotate(t * 0.15);
        for (let ray = 0; ray < 8; ray++) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(251, 191, 36, ${0.15 + Math.sin(t + ray) * 0.08})`;
          ctx.lineWidth = 1.5;
          ctx.moveTo(0, 0);
          const rayAngle = (ray * Math.PI) / 4;
          ctx.lineTo(Math.cos(rayAngle) * 95, Math.sin(rayAngle) * 95);
          ctx.stroke();
        }
        ctx.restore();

        // Central cross vertical beam
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#FBBF24';
        ctx.shadowColor = '#F59E0B';
        ctx.shadowBlur = 18;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 65);
        ctx.lineTo(centerX, centerY + 55);
        ctx.stroke();

        // Horizontal beam
        ctx.beginPath();
        ctx.moveTo(centerX - 45, centerY - 15);
        ctx.lineTo(centerX + 45, centerY - 15);
        ctx.stroke();

        // Central halo ring
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY - 15, 26, 0, Math.PI * 2);
        ctx.stroke();

        ctx.shadowBlur = 0;
      }

      // Draw active shimmering dots
      for (let i = 0; i < pointsToDraw; i++) {
        const pt = crossPoints[i];
        const pulse = Math.sin(t * 3 + i) * 2;
        const radius = shapeUnlocked ? 4.5 + pulse * 0.5 : 3 + pulse * 0.4;

        ctx.fillStyle = shapeUnlocked ? '#FEF08A' : '#D4AF37';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, Math.max(1, radius), 0, Math.PI * 2);
        ctx.fill();

        // Aura around dots
        ctx.fillStyle = shapeUnlocked
          ? 'rgba(251, 191, 36, 0.4)'
          : 'rgba(212, 175, 55, 0.25)';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, radius * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [completedCount, totalTarget, shapeUnlocked]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-slate-950 p-4 shadow-xl">
      {/* Header bar */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
          <h3 className="font-semibold text-amber-100">
            لوحة الأشكال الروحية الغامضة (Mystery Shape)
          </h3>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300 border border-amber-500/20">
          {shapeUnlocked ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>اكتمل الكشف الروحي اليوم!</span>
            </>
          ) : (
            <>
              <Lock className="h-3.5 w-3.5" />
              <span>
                {completedCount} من {totalTarget} أجزاء مكشوفة
              </span>
            </>
          )}
        </div>
      </div>

      {/* Canvas Box */}
      <div className="relative flex justify-center items-center rounded-xl overflow-hidden border border-slate-800 bg-slate-900/60">
        <canvas
          ref={canvasRef}
          className="w-full h-56 block cursor-pointer transition-transform hover:scale-[1.01]"
        />

        {/* Overlay banner when finished */}
        {shapeUnlocked && (
          <div className="absolute bottom-2 inset-x-2 rounded-lg bg-slate-900/85 backdrop-blur-md border border-amber-500/40 p-2 text-center text-xs text-amber-200 animate-fade-in flex items-center justify-center gap-2">
            <Eye className="h-4 w-4 text-amber-400" />
            <span>
              <strong>طوبى لأنقياء القلب:</strong> لقد اكتمل شكل الصليب والنور المقدس اليوم لأمانتك في كل بنود القانون الروحي!
            </span>
          </div>
        )}
      </div>

      {/* Atomic Habits Tip */}
      <p className="mt-2 text-center text-[11px] text-slate-400">
        كل بند روحي تنجزه يضيف نقطة نور إلى اللوحة؛ إتمام جميع بنود اليوم يكشف الشكل المقدس بالكامل.
      </p>
    </div>
  );
};
