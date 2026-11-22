import React, { useId } from 'react';

export const SACRED_ARCH_VIEWBOX_PATH =
  'M 50 2 C 61 12, 74 12, 79 16 Q 80 21, 77 23 Q 85 22, 91 27 Q 96 31, 96 37 L 96 87 Q 96 93, 91 97 Q 85 102, 77 101 Q 80 103, 79 108 C 74 112, 61 112, 50 122 C 39 112, 26 112, 21 108 Q 20 103, 23 101 Q 15 102, 9 97 Q 4 93, 4 87 L 4 37 Q 4 31, 9 27 Q 15 22, 23 23 Q 20 21, 21 16 C 26 12, 39 12, 50 2 Z';

export const SACRED_ARCH_INNER_PATH =
  'M 50 5.4 C 60.2 14.5, 72.2 14.5, 76.6 18.2 Q 77.5 22.4, 74.8 24.4 Q 82.4 23.8, 88.2 28.4 Q 92.8 32, 92.8 37.6 L 92.8 86.4 Q 92.8 92, 88.2 95.6 Q 82.4 100.2, 74.8 99.6 Q 77.5 101.6, 76.6 105.8 C 72.2 109.5, 60.2 109.5, 50 118.6 C 39.8 109.5, 27.8 109.5, 23.4 105.8 Q 22.5 101.6, 25.2 99.6 Q 17.6 100.2, 11.8 95.6 Q 7.2 92, 7.2 86.4 L 7.2 37.6 Q 7.2 32, 11.8 28.4 Q 17.6 23.8, 25.2 24.4 Q 22.5 22.4, 23.4 18.2 C 27.8 14.5, 39.8 14.5, 50 5.4 Z';

export const SACRED_ARCH_CLIP_PATH =
  'M 0.5 0.0161 C 0.61 0.0968, 0.74 0.0968, 0.79 0.1290 Q 0.80 0.1694, 0.77 0.1855 Q 0.85 0.1774, 0.91 0.2177 Q 0.96 0.2500, 0.96 0.2984 L 0.96 0.7016 Q 0.96 0.7500, 0.91 0.7823 Q 0.85 0.8226, 0.77 0.8145 Q 0.80 0.8306, 0.79 0.8710 C 0.74 0.9032, 0.61 0.9032, 0.5 0.9839 C 0.39 0.9032, 0.26 0.9032, 0.21 0.8710 Q 0.20 0.8306, 0.23 0.8145 Q 0.15 0.8226, 0.09 0.7823 Q 0.04 0.7500, 0.04 0.7016 L 0.04 0.2984 Q 0.04 0.2500, 0.09 0.2177 Q 0.15 0.1774, 0.23 0.1855 Q 0.20 0.1694, 0.21 0.1290 C 0.26 0.0968, 0.39 0.0968, 0.5 0.0161 Z';

/** Render once near application root so all SacredFrameCards share a crisp objectBoundingBox clipPath */
export const SacredArchClipDefs: React.FC = () => (
  <svg
    width="0"
    height="0"
    aria-hidden="true"
    className="pointer-events-none fixed h-0 w-0 overflow-hidden"
  >
    <defs>
      <clipPath id="sacred-arch-clip" clipPathUnits="objectBoundingBox">
        <path d={SACRED_ARCH_CLIP_PATH} />
      </clipPath>
    </defs>
  </svg>
);

interface SacredFrameCardProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}

export const SacredFrameCard: React.FC<SacredFrameCardProps> = ({
  children,
  className = '',
  innerClassName = '',
}) => {
  const uid = useId().replace(/:/g, '');
  const gradId = `arch-bevel-${uid}`;

  return (
    <div
      className={`relative drop-shadow-[0_18px_34px_rgba(8,12,16,0.68)] transition-all duration-300 group-hover:-translate-y-1 group-hover:drop-shadow-[0_26px_46px_rgba(8,12,16,0.88)] ${className}`}
    >
      <div
        className={`relative h-full w-full overflow-hidden ${innerClassName}`}
        style={{ clipPath: 'url(#sacred-arch-clip)' }}
      >
        {children}

        {/* Sculpted Scalloped Ogee Metallic Border */}
        <svg
          viewBox="0 0 100 124"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 h-full w-full opacity-80 transition-opacity duration-300 group-hover:opacity-100"
        >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F7CA6B" stopOpacity="0.95" />
              <stop offset="28%" stopColor="#F19A36" stopOpacity="0.92" />
              <stop offset="56%" stopColor="#CC3E26" stopOpacity="0.9" />
              <stop offset="82%" stopColor="#1CC8BE" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#083339" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <path
            d={SACRED_ARCH_VIEWBOX_PATH}
            stroke={`url(#${gradId})`}
            strokeWidth="3.6"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={SACRED_ARCH_INNER_PATH}
            stroke="rgba(253,242,218,0.34)"
            strokeWidth="0.9"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
};
