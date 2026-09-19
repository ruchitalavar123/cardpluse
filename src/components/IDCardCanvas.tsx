'use client';

import React, { useEffect, useRef } from 'react';
import { StudentSubmission, Template } from '../types';

interface IDCardCanvasProps {
  student: StudentSubmission;
  template: Template;
  side?: 'front' | 'back';
  scale?: number;
  watermark?: boolean;
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

  // Card dimensions standard CR-80 ratio (width: 250px, height: 350px scaled by 'scale')
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
      const bgColor = side === 'front' ? template.frontBgColor : template.backBgColor;
      ctx.fillStyle = bgColor;
      ctx.beginPath();
      ctx.roundRect(0, 0, width, height, 12 * scale);
      ctx.fill();

      // Header Arc
      const gradient = ctx.createLinearGradient(0, 0, width, 100 * scale);
      gradient.addColorStop(0, template.primaryColor);
      gradient.addColorStop(1, template.accentColor);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(width, 0);
      ctx.lineTo(width, 80 * scale);
      ctx.quadraticCurveTo(width / 2, 110 * scale, 0, 80 * scale);
      ctx.closePath();
      ctx.fill();
    }

    function renderCardContent() {
      if (!ctx) return;
      if (side === 'front') {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(width, 0);
        ctx.lineTo(width, 80 * scale);
        ctx.quadraticCurveTo(width / 2, 110 * scale, 0, 80 * scale);
        ctx.closePath();
        ctx.fill();

        // Card Header Title
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.round(13 * scale)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('ST. XAVIER ACADEMY', width / 2, 28 * scale);
        ctx.font = `${Math.round(9 * scale)}px sans-serif`;
        ctx.fillText('STUDENT IDENTIFICATION CARD', width / 2, 44 * scale);

        // Render Photo Box Area
        const pz = template.photoZone;
        const px = pz.x * scale;
        const py = pz.y * scale;
        const pw = pz.width * scale;
        const ph = pz.height * scale;

        // Draw Photo Border / Placeholder background
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = activeTool === 'photo' && isInteractive ? '#06b6d4' : template.primaryColor;
        ctx.lineWidth = (activeTool === 'photo' && isInteractive ? 4 : 3) * scale;

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

        // Highlight selection border when photo tool active
        if (isInteractive && activeTool === 'photo') {
          ctx.strokeStyle = '#38bdf8';
          ctx.setLineDash([4 * scale, 4 * scale]);
          ctx.strokeRect(px - 4 * scale, py - 4 * scale, pw + 8 * scale, ph + 8 * scale);
          ctx.setLineDash([]);
        }

        // Load & Render Student Photo onto canvas with auto-fit pan/zoom
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
            ctx.fillText('NO PHOTO', px + pw / 2, py + ph / 2);
            renderTextPlaceholders(ctx);
            renderWatermark(ctx);
          };
        } else {
          renderTextPlaceholders(ctx);
          renderWatermark(ctx);
        }
      } else {
        // BACK SIDE DESIGN
        ctx.fillStyle = template.accentColor;
        ctx.fillRect(0, 0, width, 12 * scale);

        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.round(12 * scale)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('TERMS & CONDITIONS', width / 2, 40 * scale);

        ctx.fillStyle = '#94a3b8';
        ctx.font = `${Math.round(8 * scale)}px sans-serif`;
        const terms = [
          '1. This card is property of St. Xavier Academy.',
          '2. Must be presented upon request.',
          '3. If found, please return to school office.',
          '4. Emergency Support: +91 98765 43210'
        ];
        terms.forEach((line, idx) => {
          ctx.fillText(line, width / 2, (70 + idx * 16) * scale);
        });

        // Dummy Barcode / QR Box
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(50 * scale, 180 * scale, 150 * scale, 50 * scale);

        ctx.fillStyle = '#000000';
        ctx.font = `bold ${Math.round(10 * scale)}px monospace`;
        ctx.fillText(`|||| || ||| ||||| || ${student.rollNo}`, width / 2, 210 * scale);

        ctx.fillStyle = '#64748b';
        ctx.font = `${Math.round(8 * scale)}px sans-serif`;
        ctx.fillText(`VALID UP TO: 2027`, width / 2, 280 * scale);

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
          context.fillStyle = 'rgba(168, 85, 247, 0.2)';
          context.strokeStyle = '#c084fc';
          context.lineWidth = 1.5 * scale;
          context.fillRect(tx - 60 * scale, ty - fontSize, 120 * scale, fontSize * 1.4);
          context.strokeRect(tx - 60 * scale, ty - fontSize, 120 * scale, fontSize * 1.4);
        }

        context.fillStyle = isSelected ? '#a855f7' : (placeholder.color || '#ffffff');
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
      context.fillStyle = 'rgba(239, 68, 68, 0.28)';
      context.font = `bold ${Math.round(22 * scale)}px sans-serif`;
      context.textAlign = 'center';
      context.fillText('PREVIEW ONLY', 0, 0);
      context.fillText('UNAPPROVED', 0, 25 * scale);
      context.restore();
    }

    return () => {
      isSubscribed = false;
    };
  }, [student, template, side, scale, watermark, width, height, activeTool, selectedPlaceholderKey, isInteractive]);

  // Drag & Drop Handlers for Canvas Photo & Text Positioning
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
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`rounded-xl shadow-lg border border-slate-700/50 ${isInteractive ? 'cursor-grab active:cursor-grabbing border-cyan-500/80 shadow-cyan-500/20' : ''} ${className}`}
    />
  );
};

