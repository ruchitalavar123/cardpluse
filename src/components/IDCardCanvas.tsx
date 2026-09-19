'use client';

import React, { useEffect, useRef } from 'react';
import { StudentSubmission, Template } from '../types';

interface IDCardCanvasProps {
  student: StudentSubmission;
  template: Template;
  side?: 'front' | 'back';
  scale?: number;
  watermark?: boolean;
  showLanyard?: boolean;
  schoolName?: string;
  className?: string;
  isInteractive?: boolean;
  activeTool?: 'photo' | 'text';
  selectedPlaceholderKey?: string;
  onPhotoPanChange?: (panX: number, panY: number) => void;
  onPlaceholderMove?: (key: string, x: number, y: number) => void;
}

export const IDCardCanvas: React.FC<IDCardCanvasProps> = ({
  student,
  template,
  side = 'front',
  scale = 1.0,
  watermark = false,
  showLanyard = false,
  schoolName = 'KVG INSTITUTE OF TECHNOLOGY',
  className = '',
  isInteractive = false,
  activeTool = 'photo',
  selectedPlaceholderKey,
  onPhotoPanChange,
  onPlaceholderMove,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialPanRef = useRef<{ panX: number; panY: number }>({ panX: 0, panY: 0 });
  const initialPlaceholderPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Standard CR-80 format (250x350 scaled)
  const baseWidth = 250;
  const baseHeight = 350;
  const width = Math.round(baseWidth * scale);
  const height = Math.round(baseHeight * scale);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isSubscribed = true;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Render Card Background Graphic Artwork (PNG/Image upload or programmatic gradient)
    const assetUrl = side === 'front' ? template.frontAssetUrl : template.backAssetUrl;

    if (assetUrl) {
      const bgImg = new Image();
      bgImg.crossOrigin = 'anonymous';
      bgImg.src = assetUrl;
      bgImg.onload = () => {
        if (!isSubscribed) return;
        ctx.drawImage(bgImg, 0, 0, width, height);
        renderCardContent();
      };
      bgImg.onerror = () => {
        renderFallbackBackground();
        renderCardContent();
      };
    } else {
      renderFallbackBackground();
      renderCardContent();
    }

    function renderFallbackBackground() {
      if (!ctx) return;
      const bgColor = side === 'front' ? (template.frontBgColor || '#0f172a') : (template.backBgColor || '#1e293b');
      ctx.fillStyle = bgColor;
      ctx.beginPath();
      ctx.roundRect(0, 0, width, height, 12 * scale);
      ctx.fill();

      // Top Punch Hole Slot indicator for Lanyard clip
      ctx.fillStyle = '#0b0f19';
      ctx.beginPath();
      ctx.roundRect((width / 2) - (14 * scale), 6 * scale, 28 * scale, 5 * scale, 3 * scale);
      ctx.fill();

      // Header Banner Arc
      const gradient = ctx.createLinearGradient(0, 0, width, 95 * scale);
      gradient.addColorStop(0, template.primaryColor || '#dc2626');
      gradient.addColorStop(1, '#991b1b');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(width, 0);
      ctx.lineTo(width, 78 * scale);
      ctx.quadraticCurveTo(width / 2, 100 * scale, 0, 78 * scale);
      ctx.closePath();
      ctx.fill();

      // Subtle gold accent line
      ctx.strokeStyle = template.accentColor || '#f59e0b';
      ctx.lineWidth = 2 * scale;
      ctx.beginPath();
      ctx.moveTo(0, 80 * scale);
      ctx.quadraticCurveTo(width / 2, 102 * scale, width, 80 * scale);
      ctx.stroke();
    }

    function renderCardContent() {
      if (!ctx) return;
      if (side === 'front') {
        // Institution Header Title
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.round(11 * scale)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(schoolName.toUpperCase(), width / 2, 30 * scale);
        
        ctx.fillStyle = '#fef2f2';
        ctx.font = `600 ${Math.round(8 * scale)}px sans-serif`;
        ctx.fillText('STUDENT IDENTITY CARD', width / 2, 44 * scale);

        // Render Photo Box Area
        const pz = template.photoZone;
        const px = pz.x * scale;
        const py = pz.y * scale;
        const pw = pz.width * scale;
        const ph = pz.height * scale;

        // Draw Photo Border / Placeholder
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = activeTool === 'photo' && isInteractive ? '#dc2626' : (template.primaryColor || '#dc2626');
        ctx.lineWidth = (activeTool === 'photo' && isInteractive ? 3 : 2.5) * scale;

        if (pz.shape === 'oval') {
          ctx.beginPath();
          ctx.ellipse(px + pw / 2, py + ph / 2, pw / 2, ph / 2, 0, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.roundRect(px, py, pw, ph, pz.shape === 'rounded' ? 10 * scale : 2 * scale);
          ctx.fill();
          ctx.stroke();
        }

        // Selection highlight indicator
        if (isInteractive && activeTool === 'photo') {
          ctx.strokeStyle = '#ef4444';
          ctx.setLineDash([4 * scale, 3 * scale]);
          ctx.strokeRect(px - 3 * scale, py - 3 * scale, pw + 6 * scale, ph + 6 * scale);
          ctx.setLineDash([]);
        }

        // Load & Render Student Photo onto canvas
        if (student.photoUrl) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = student.photoUrl;
          img.onload = () => {
            if (!isSubscribed) return;

            ctx.save();
            ctx.beginPath();
            if (pz.shape === 'oval') {
              ctx.ellipse(px + pw / 2, py + ph / 2, pw / 2, ph / 2, 0, 0, 2 * Math.PI);
            } else {
              ctx.roundRect(px, py, pw, ph, pz.shape === 'rounded' ? 10 * scale : 2 * scale);
            }
            ctx.clip();

            const panX = (student.panX || 0) * scale;
            const panY = (student.panY || 0) * scale;
            const zoom = student.zoom || 1.0;

            const imgAspect = img.width / img.height;
            const zoneAspect = pw / ph;

            let drawW = pw * zoom;
            let drawH = ph * zoom;

            if (imgAspect > zoneAspect) {
              drawW = ph * imgAspect * zoom;
            } else {
              drawH = (pw / imgAspect) * zoom;
            }

            const drawX = px + (pw - drawW) / 2 + panX;
            const drawY = py + (ph - drawH) / 2 + panY;

            ctx.drawImage(img, drawX, drawY, drawW, drawH);
            ctx.restore();

            renderTextPlaceholders(ctx);
            renderWatermark(ctx);
          };

          img.onerror = () => {
            ctx.fillStyle = '#64748b';
            ctx.font = `${Math.round(10 * scale)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('PHOTO UNAVAILABLE', px + pw / 2, py + ph / 2);
            renderTextPlaceholders(ctx);
            renderWatermark(ctx);
          };
        } else {
          renderTextPlaceholders(ctx);
          renderWatermark(ctx);
        }
      } else {
        // BACK SIDE DESIGN
        ctx.fillStyle = template.accentColor || '#f59e0b';
        ctx.fillRect(0, 0, width, 10 * scale);

        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.round(11 * scale)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('TERMS & CONDITIONS', width / 2, 38 * scale);

        ctx.fillStyle = '#94a3b8';
        ctx.font = `${Math.round(8 * scale)}px sans-serif`;
        const terms = [
          '1. Card is valid for authorized institutional tenure.',
          '2. Non-transferable; must be carried on campus.',
          '3. Loss or theft must be reported immediately.',
          '4. Support & Replacement: Yash Enterprises'
        ];
        terms.forEach((line, idx) => {
          ctx.fillText(line, width / 2, (68 + idx * 15) * scale);
        });

        // Barcode Mockup
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(40 * scale, 175 * scale, 170 * scale, 45 * scale, 4 * scale);
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.font = `bold ${Math.round(10 * scale)}px monospace`;
        ctx.fillText(`|||| | ||||| || |||| || ${student.rollNo}`, width / 2, 202 * scale);

        ctx.fillStyle = '#64748b';
        ctx.font = `${Math.round(8 * scale)}px sans-serif`;
        ctx.fillText('VALID UP TO: 2027 • YASH ENTERPRISES', width / 2, 270 * scale);

        renderWatermark(ctx);
      }
    }

    function renderTextPlaceholders(context: CanvasRenderingContext2D) {
      if (side !== 'front') return;
      template.textPlaceholders.forEach(placeholder => {
        let val = (student as any)[placeholder.key] || 'N/A';
        if (placeholder.key === 'className' && student.division) {
          val = `${student.className} - ${student.division}`;
        }

        const isSelected = selectedPlaceholderKey === placeholder.key && activeTool === 'text';
        const fontWg = placeholder.fontWeight || 'normal';
        const fontSize = Math.round((placeholder.fontSize || 12) * scale);
        
        const tx = placeholder.x * scale;
        const ty = placeholder.y * scale;

        if (isSelected && isInteractive) {
          context.fillStyle = 'rgba(220, 38, 38, 0.15)';
          context.strokeStyle = '#dc2626';
          context.lineWidth = 1.5 * scale;
          context.beginPath();
          context.roundRect(tx - 60 * scale, ty - fontSize, 120 * scale, fontSize * 1.4, 4 * scale);
          context.fill();
          context.stroke();
        }

        context.fillStyle = isSelected ? '#ef4444' : (placeholder.color || '#ffffff');
        context.font = `${fontWg} ${fontSize}px sans-serif`;
        context.textAlign = (placeholder.align as CanvasTextAlign) || 'center';

        context.fillText(String(val), tx, ty);
      });
    }

    function renderWatermark(context: CanvasRenderingContext2D) {
      if (!watermark) return;
      context.save();
      context.translate(width / 2, height / 2);
      context.rotate((-35 * Math.PI) / 180);
      context.fillStyle = 'rgba(239, 68, 68, 0.25)';
      context.font = `bold ${Math.round(20 * scale)}px sans-serif`;
      context.textAlign = 'center';
      context.fillText('PREVIEW ONLY', 0, 0);
      context.fillText('UNAPPROVED', 0, 24 * scale);
      context.restore();
    }

    return () => {
      isSubscribed = false;
    };
  }, [student, template, side, scale, watermark, width, height, activeTool, selectedPlaceholderKey, isInteractive, schoolName]);

  // Drag & Drop Handlers for Photo & Text Positioning
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isInteractive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / scale;
    const mouseY = (e.clientY - rect.top) / scale;

    isDraggingRef.current = true;
    dragStartRef.current = { x: mouseX, y: mouseY };

    if (activeTool === 'photo') {
      initialPanRef.current = { panX: student.panX || 0, panY: student.panY || 0 };
    } else if (activeTool === 'text' && selectedPlaceholderKey) {
      const pl = template.textPlaceholders.find(p => p.key === selectedPlaceholderKey);
      if (pl) {
        initialPlaceholderPosRef.current = { x: pl.x, y: pl.y };
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isInteractive || !isDraggingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / scale;
    const mouseY = (e.clientY - rect.top) / scale;

    const deltaX = mouseX - dragStartRef.current.x;
    const deltaY = mouseY - dragStartRef.current.y;

    if (activeTool === 'photo' && onPhotoPanChange) {
      const newPanX = Math.round(initialPanRef.current.panX + deltaX);
      const newPanY = Math.round(initialPanRef.current.panY + deltaY);
      onPhotoPanChange(newPanX, newPanY);
    } else if (activeTool === 'text' && selectedPlaceholderKey && onPlaceholderMove) {
      const newX = Math.round(initialPlaceholderPosRef.current.x + deltaX);
      const newY = Math.round(initialPlaceholderPosRef.current.y + deltaY);
      onPlaceholderMove(selectedPlaceholderKey, newX, newY);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="flex flex-col items-center select-none">
      {/* Optional Yash Enterprises Lanyard Mockup (Directly matching photo) */}
      {showLanyard && (
        <div className="flex flex-col items-center -mb-2 z-10">
          {/* Crimson Ribbon */}
          <div
            className="h-16 bg-gradient-to-b from-red-600 via-red-600 to-red-700 shadow-md flex items-center justify-center px-3 border-x border-red-800 text-white font-black tracking-widest text-[9px] uppercase shadow-red-950/40 relative overflow-hidden"
            style={{ width: Math.round(48 * scale) }}
          >
            {/* Ribbon stitch accents */}
            <div className="absolute inset-y-0 left-0.5 w-0.5 border-l border-amber-400/40" />
            <div className="absolute inset-y-0 right-0.5 w-0.5 border-r border-amber-400/40" />
            
            {/* Rotated text resembling the lanyard */}
            <span className="rotate-90 whitespace-nowrap text-[8px] font-bold tracking-tight text-white/95">
              YASH ENTERPRISES
            </span>
          </div>

          {/* Chrome Metal Clip & Swivel */}
          <div className="w-5 h-4 bg-gradient-to-b from-slate-300 via-slate-100 to-slate-400 rounded-sm shadow-sm border border-slate-400 flex items-center justify-center">
            <div className="w-2.5 h-1 bg-slate-600 rounded-full" />
          </div>
          <div className="w-2 h-3 bg-gradient-to-r from-slate-400 to-slate-300 -mt-0.5 rounded-b-sm" />
        </div>
      )}

      {/* The ID Card Canvas */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`rounded-2xl shadow-xl border border-slate-800/90 transition-all ${
          isInteractive
            ? 'cursor-grab active:cursor-grabbing ring-2 ring-red-500/80 shadow-red-950/30'
            : ''
        } ${className}`}
      />
    </div>
  );
};
