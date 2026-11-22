import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HERO_REFERENCE_ART = '/assets/aistudio/download__6__963be6c3.jpeg';

const FLOATING_PARTICLES = [
  { top: '14%', left: '8%', size: 12, kind: 'flower' as const, delay: 0.2 },
  { top: '28%', left: '4%', size: 8, kind: 'star' as const, delay: 0.9 },
  { top: '62%', left: '7%', size: 11, kind: 'flower' as const, delay: 1.5 },
  { top: '78%', left: '14%', size: 7, kind: 'star' as const, delay: 0.5 },
  { top: '12%', left: '46%', size: 8, kind: 'star' as const, delay: 1.1 },
  { top: '18%', right: '8%', size: 11, kind: 'flower' as const, delay: 0.4 },
  { top: '38%', right: '5%', size: 7, kind: 'star' as const, delay: 1.7 },
  { top: '58%', right: '7%', size: 13, kind: 'flower' as const, delay: 0.7 },
  { top: '76%', right: '11%', size: 9, kind: 'star' as const, delay: 1.3 },
  { top: '84%', right: '26%', size: 10, kind: 'flower' as const, delay: 2.0 },
];

export const HeroMovingAura: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bgArtRef = useRef<HTMLDivElement | null>(null);
  const vineLeftRef = useRef<SVGSVGElement | null>(null);
  const vineRightRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      // 1. Deep crimson-gold reference texture — soft ambient breathing + scroll parallax
      if (bgArtRef.current) {
        gsap.to(bgArtRef.current, {
          opacity: 0.34,
          scale: 1.04,
          duration: 6.5,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        });

        gsap.to(bgArtRef.current, {
          yPercent: -9,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero-stage',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }

      // 2. Botanical filigree vine draw-in & gentle breeze sway
      const stemPaths = el.querySelectorAll<SVGGeometryElement>('.aura-vine-stem');
      stemPaths.forEach((path) => {
        const len = path.getTotalLength ? path.getTotalLength() : 900;
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 2.1,
          ease: 'power2.out',
          delay: 0.15,
        });
      });

      gsap.from('.aura-bloom', {
        scale: 0,
        rotation: -28,
        opacity: 0,
        transformOrigin: 'center center',
        duration: 0.9,
        stagger: 0.08,
        delay: 0.85,
        ease: 'back.out(1.6)',
      });

      if (vineLeftRef.current) {
        gsap.to(vineLeftRef.current, {
          rotation: 1.6,
          y: 6,
          transformOrigin: 'top left',
          duration: 5.5,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        });

        gsap.to(vineLeftRef.current, {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero-stage',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.3,
          },
        });
      }

      if (vineRightRef.current) {
        gsap.to(vineRightRef.current, {
          rotation: -1.8,
          y: -6,
          transformOrigin: 'bottom right',
          duration: 6.2,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        });

        gsap.to(vineRightRef.current, {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero-stage',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.15,
          },
        });
      }

      // 3. Floating golden blossoms & 4-point sparkles
      el.querySelectorAll<HTMLElement>('.aura-float-spark').forEach((node, idx) => {
        gsap.to(node, {
          y: idx % 2 === 0 ? -18 : -12,
          x: idx % 3 === 0 ? 7 : -6,
          rotation: idx % 2 === 0 ? 32 : -28,
          opacity: 0.88,
          duration: 3.4 + (idx % 4) * 0.85,
          delay: Number(node.dataset.delay || '0'),
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
    >
      {/* Sunburst Vermilion (#B82E1E), Abyssal Teal (#083339) & Peacock Turquoise (#1CC8BE) Atmospheric Studio Glow */}
      <div
        className="absolute -top-24 left-[6%] h-[68vw] max-h-[520px] w-[88vw] max-w-[620px] rounded-full bg-[radial-gradient(circle,rgba(204,62,38,0.4)_0%,rgba(15,164,158,0.34)_48%,transparent_72%)] blur-3xl sm:left-[12%]"
      />

      {/* Feathered Reference Texture Overlay (Sculpted Slate & Rose Blend) */}
      <div
        ref={bgArtRef}
        className="absolute inset-y-0 right-[-8%] w-[92%] opacity-[0.26] mix-blend-screen sm:right-[-4%] sm:w-[76%] lg:w-[62%] will-change-transform"
        style={{
          WebkitMaskImage:
            'radial-gradient(ellipse 76% 72% at 62% 46%, #000 12%, rgba(0,0,0,0.48) 48%, transparent 80%)',
          maskImage:
            'radial-gradient(ellipse 76% 72% at 62% 46%, #000 12%, rgba(0,0,0,0.48) 48%, transparent 80%)',
        }}
      >
        <img
          src={HERO_REFERENCE_ART}
          alt=""
          draggable={false}
          decoding="async"
          className="h-full w-full object-cover object-center brightness-95 contrast-110"
        />
      </div>

      {/* Delicate Left-Upper Sweeping Botanical Filigree Vine */}
      <svg
        ref={vineLeftRef}
        viewBox="0 0 420 560"
        fill="none"
        className="absolute -left-10 -top-6 hidden h-[440px] w-[330px] opacity-40 sm:block lg:left-0 lg:h-[520px] lg:w-[390px] lg:opacity-55 will-change-transform"
      >
        <path
          className="aura-vine-stem"
          d="M28 -10 C 62 64, 154 78, 224 44 C 280 16, 336 42, 358 96 C 374 134, 344 172, 312 152 C 288 138, 304 104, 326 116"
          stroke="url(#heroVineGold)"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path
          className="aura-vine-stem"
          d="M74 68 C 36 146, 22 238, 56 324 C 84 396, 44 468, 92 528"
          stroke="url(#heroVineGold)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          className="aura-vine-stem"
          d="M52 214 C 98 202, 134 226, 126 258 C 120 282, 92 276, 98 256"
          stroke="url(#heroVineGold)"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        {/* Fine Amber & Vermilion Leaves */}
        <path
          className="aura-bloom"
          d="M148 56 Q 168 32 192 42 Q 172 64 148 56 Z"
          stroke="#F7CA6B"
          strokeWidth="0.85"
          fill="rgba(204,62,38,0.32)"
        />
        <path
          className="aura-bloom"
          d="M42 156 Q 16 174 28 198 Q 52 180 42 156 Z"
          stroke="#F7CA6B"
          strokeWidth="0.85"
          fill="rgba(15,164,158,0.36)"
        />
        <path
          className="aura-bloom"
          d="M56 324 Q 90 314 98 338 Q 70 344 56 324 Z"
          stroke="#F7CA6B"
          strokeWidth="0.85"
          fill="rgba(204,62,38,0.32)"
        />
        {/* 5-Petal Filigree Blossom */}
        <g className="aura-bloom" transform="translate(82 72)">
          {[0, 72, 144, 216, 288].map((deg) => (
            <path
              key={deg}
              d="M0 0 C -5 -9, -4 -18, 0 -20 C 4 -18, 5 -9, 0 0 Z"
              transform={`rotate(${deg})`}
              stroke="#F7CA6B"
              strokeWidth="0.9"
              fill="rgba(241,154,54,0.32)"
            />
          ))}
          <circle r="2.6" fill="#1CC8BE" />
        </g>
        <defs>
          <linearGradient id="heroVineGold" x1="0" y1="0" x2="360" y2="520" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F7CA6B" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#CC3E26" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0FA49E" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>

      {/* Delicate Bottom-Right Sweeping Botanical Vine & Blossoms */}
      <svg
        ref={vineRightRef}
        viewBox="0 0 420 520"
        fill="none"
        className="absolute -bottom-8 -right-8 hidden h-[400px] w-[320px] opacity-45 sm:block lg:right-0 lg:h-[470px] lg:w-[370px] lg:opacity-65 will-change-transform"
      >
        <path
          className="aura-vine-stem"
          d="M402 496 C 324 468, 254 446, 206 382 C 164 326, 206 254, 272 262 C 322 268, 332 322, 294 338 C 266 350, 248 322, 266 306"
          stroke="url(#heroVineGoldR)"
          strokeWidth="1.15"
          strokeLinecap="round"
        />
        <path
          className="aura-vine-stem"
          d="M360 448 C 386 356, 392 246, 344 152 C 314 94, 346 42, 392 22"
          stroke="url(#heroVineGoldR)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        {/* Small Turquoise & Vermilion Leaves */}
        <path
          className="aura-bloom"
          d="M368 258 Q 338 242 332 266 Q 354 274 368 258 Z"
          stroke="#F7CA6B"
          strokeWidth="0.85"
          fill="rgba(15,164,158,0.36)"
        />
        <path
          className="aura-bloom"
          d="M242 418 Q 214 438 228 456 Q 252 438 242 418 Z"
          stroke="#F7CA6B"
          strokeWidth="0.85"
          fill="rgba(204,62,38,0.34)"
        />
        {/* Amber & Vermilion Blossoms */}
        <g className="aura-bloom" transform="translate(342 308)">
          {[0, 72, 144, 216, 288].map((deg) => (
            <path
              key={deg}
              d="M0 0 C -4 -7, -3.5 -13, 0 -15 C 3.5 -13, 4 -7, 0 0 Z"
              transform={`rotate(${deg})`}
              stroke="#F7CA6B"
              strokeWidth="0.85"
              fill="rgba(204,62,38,0.34)"
            />
          ))}
          <circle r="2.1" fill="#F19A36" />
        </g>
        <g className="aura-bloom" transform="translate(274 426) scale(0.76)">
          {[0, 72, 144, 216, 288].map((deg) => (
            <path
              key={deg}
              d="M0 0 C -4 -7, -3.5 -13, 0 -15 C 3.5 -13, 4 -7, 0 0 Z"
              transform={`rotate(${deg})`}
              stroke="#F7CA6B"
              strokeWidth="0.85"
              fill="rgba(241,154,54,0.26)"
            />
          ))}
          <circle r="2.1" fill="#1CC8BE" />
        </g>
        <defs>
          <linearGradient id="heroVineGoldR" x1="400" y1="500" x2="180" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F7CA6B" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#CC3E26" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0FA49E" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating Marigold & Kumkum Sparkles */}
      {FLOATING_PARTICLES.map((pt, idx) => (
        <span
          key={idx}
          data-delay={pt.delay}
          className="aura-float-spark absolute opacity-35 will-change-transform"
          style={{
            top: pt.top,
            left: pt.left,
            right: pt.right,
            width: pt.size,
            height: pt.size,
          }}
        >
          {pt.kind === 'flower' ? (
            <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
              {[0, 72, 144, 216, 288].map((deg) => (
                <ellipse
                  key={deg}
                  cx="12"
                  cy="6.5"
                  rx="2.3"
                  ry="4.2"
                  transform={`rotate(${deg} 12 12)`}
                  fill="rgba(241,154,54,0.44)"
                  stroke="#FDF2DA"
                  strokeWidth="0.7"
                />
              ))}
              <circle cx="12" cy="12" r="1.6" fill="#0FA49E" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" fill="none" className="h-full w-full">
              <path
                d="M8 1 L9.4 6.6 L15 8 L9.4 9.4 L8 15 L6.6 9.4 L1 8 L6.6 6.6 Z"
                fill="rgba(247,202,107,0.78)"
              />
            </svg>
          )}
        </span>
      ))}
    </div>
  );
};

interface HeroShrineMandalaHaloProps {
  outerRef: React.RefObject<SVGSVGElement | null>;
  innerRef: React.RefObject<SVGSVGElement | null>;
}

export const HeroShrineMandalaHalo: React.FC<HeroShrineMandalaHaloProps> = ({
  outerRef,
  innerRef,
}) => {
  const outerPetals = Array.from({ length: 16 }, (_, i) => i * 22.5);
  const innerPetals = Array.from({ length: 12 }, (_, i) => i * 30);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-[44%] z-0 aspect-square w-[112%] max-w-none -translate-x-1/2 -translate-y-1/2 select-none sm:top-[46%] sm:w-[124%]"
    >
      {/* Sunburst Vermilion (#B82E1E), Golden Amber (#F19A36) & Turquoise (#1CC8BE) Halo Behind the 3D Diya */}
      <span className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle,rgba(247,202,107,0.24)_0%,rgba(204,62,38,0.36)_44%,rgba(15,164,158,0.24)_62%,transparent_76%)] blur-2xl" />

      {/* Outer Lotus Crown Ring */}
      <svg
        ref={outerRef}
        viewBox="0 0 400 400"
        fill="none"
        className="absolute inset-0 h-full w-full opacity-55 will-change-transform"
      >
        <circle
          cx="200"
          cy="200"
          r="176"
          stroke="rgba(247,202,107,0.36)"
          strokeWidth="0.7"
          strokeDasharray="3 5"
        />
        <circle
          cx="200"
          cy="200"
          r="150"
          stroke="rgba(28,200,190,0.3)"
          strokeWidth="0.6"
        />
        {outerPetals.map((deg) => (
          <g key={deg} transform={`rotate(${deg} 200 200)`}>
            <path
              d="M200 22 C 212 42, 214 64, 200 80 C 186 64, 188 42, 200 22 Z"
              stroke="rgba(247,202,107,0.58)"
              strokeWidth="0.8"
              fill="rgba(204,62,38,0.22)"
            />
            <path
              d="M200 32 C 206 46, 206 60, 200 72 C 194 60, 194 46, 200 32 Z"
              stroke="rgba(241,154,54,0.4)"
              strokeWidth="0.6"
            />
            <circle cx="200" cy="14" r="1.4" fill="rgba(247,202,107,0.82)" />
          </g>
        ))}
      </svg>

      {/* Inner Filigree Rosette Ring */}
      <svg
        ref={innerRef}
        viewBox="0 0 400 400"
        fill="none"
        className="absolute inset-[14%] h-[72%] w-[72%] opacity-65 will-change-transform"
      >
        <circle
          cx="200"
          cy="200"
          r="134"
          stroke="rgba(247,202,107,0.34)"
          strokeWidth="0.8"
        />
        {innerPetals.map((deg) => (
          <g key={deg} transform={`rotate(${deg} 200 200)`}>
            <path
              d="M200 66 C 216 92, 214 118, 200 134 C 186 118, 184 92, 200 66 Z"
              stroke="rgba(247,202,107,0.56)"
              strokeWidth="0.85"
              fill="rgba(15,164,158,0.26)"
            />
            <circle cx="200" cy="58" r="1.3" fill="#F7CA6B" fillOpacity="0.82" />
          </g>
        ))}
      </svg>
    </div>
  );
};
