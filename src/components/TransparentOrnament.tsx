import React, { useEffect, useState } from 'react';

type KeyMode = 'white-edge' | 'checker-edge';

interface TransparentOrnamentProps {
  src: string;
  mode: KeyMode;
  crop?: { x: number; y: number; w: number; h: number };
  className?: string;
  alt?: string;
  style?: React.CSSProperties;
}

const processedCache = new Map<string, string>();

function keyOutBackground(
  img: HTMLImageElement,
  mode: KeyMode,
  crop?: { x: number; y: number; w: number; h: number }
): string {
  const sx = crop ? Math.floor(img.naturalWidth * crop.x) : 0;
  const sy = crop ? Math.floor(img.naturalHeight * crop.y) : 0;
  const sw = crop ? Math.floor(img.naturalWidth * crop.w) : img.naturalWidth;
  const sh = crop ? Math.floor(img.naturalHeight * crop.h) : img.naturalHeight;

  const maxDim = 920;
  const scale = Math.min(1, maxDim / Math.max(sw, sh));
  const w = Math.max(1, Math.round(sw * scale));
  const h = Math.max(1, Math.round(sh * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return img.src;

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  const isBg = (idx: number): boolean => {
    const o = idx * 4;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max - min;

    if (mode === 'white-edge') {
      return min > 226 && sat < 26;
    }
    // checker-edge: neutral light/mid-gray checkerboard squares (white ~255 and gray ~200)
    return min > 172 && sat < 22;
  };

  const total = w * h;
  const visited = new Uint8Array(total);
  const bgMask = new Uint8Array(total);
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;

  const enqueue = (idx: number) => {
    if (visited[idx]) return;
    visited[idx] = 1;
    if (isBg(idx)) {
      bgMask[idx] = 1;
      queue[tail++] = idx;
    }
  };

  // Seed flood-fill from all 4 outer borders
  for (let x = 0; x < w; x++) {
    enqueue(x);
    enqueue((h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    enqueue(y * w);
    enqueue(y * w + (w - 1));
  }

  while (head < tail) {
    const curr = queue[head++];
    const cx = curr % w;
    const cy = (curr - cx) / w;

    if (cx > 0) enqueue(curr - 1);
    if (cx < w - 1) enqueue(curr + 1);
    if (cy > 0) enqueue(curr - w);
    if (cy < h - 1) enqueue(curr + w);
  }

  // Clear background pixels and softly feather 1px edge halo
  for (let i = 0; i < total; i++) {
    const o = i * 4;
    if (bgMask[i]) {
      data[o + 3] = 0;
      continue;
    }

    const cx = i % w;
    const cy = (i - cx) / w;
    let bgNeighbors = 0;
    if (cx > 0 && bgMask[i - 1]) bgNeighbors++;
    if (cx < w - 1 && bgMask[i + 1]) bgNeighbors++;
    if (cy > 0 && bgMask[i - w]) bgNeighbors++;
    if (cy < h - 1 && bgMask[i + w]) bgNeighbors++;

    if (bgNeighbors > 0) {
      // Soften bright fringe pixels adjacent to keyed background
      const lum = (data[o] + data[o + 1] + data[o + 2]) / 3;
      if (lum > 185) {
        data[o + 3] = Math.round(255 * Math.max(0.25, 1 - bgNeighbors * 0.2));
      }
      // Subtle warm dark de-fringing so edges never show white halos on dark canvas
      data[o] = Math.round(data[o] * 0.86);
      data[o + 1] = Math.round(data[o + 1] * 0.84);
      data[o + 2] = Math.round(data[o + 2] * 0.78);
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}

export const TransparentOrnament = React.forwardRef<HTMLImageElement, TransparentOrnamentProps>(
  ({ src, mode, crop, className = '', alt = '', style }, ref) => {
    const cacheKey = `${src}|${mode}|${crop ? `${crop.x},${crop.y},${crop.w},${crop.h}` : 'full'}`;
    const [dataUrl, setDataUrl] = useState<string>(() => processedCache.get(cacheKey) || '');

    const cropX = crop?.x;
    const cropY = crop?.y;
    const cropW = crop?.w;
    const cropH = crop?.h;

    useEffect(() => {
      if (processedCache.has(cacheKey)) {
        setDataUrl(processedCache.get(cacheKey)!);
        return;
      }

      const cropRect =
        cropX !== undefined && cropY !== undefined && cropW !== undefined && cropH !== undefined
          ? { x: cropX, y: cropY, w: cropW, h: cropH }
          : undefined;

      let cancelled = false;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        if (cancelled) return;
        try {
          const out = keyOutBackground(img, mode, cropRect);
          processedCache.set(cacheKey, out);
          setDataUrl(out);
        } catch {
          setDataUrl(src);
        }
      };
      img.onerror = () => {
        if (!cancelled) setDataUrl(src);
      };
      img.src = src;

      return () => {
        cancelled = true;
      };
    }, [src, mode, cacheKey, cropX, cropY, cropW, cropH]);

    if (!dataUrl) return null;

    return (
      <img
        ref={ref}
        src={dataUrl}
        alt={alt}
        draggable={false}
        decoding="async"
        referrerPolicy="no-referrer"
        className={className}
        style={style}
      />
    );
  }
);

TransparentOrnament.displayName = 'TransparentOrnament';
