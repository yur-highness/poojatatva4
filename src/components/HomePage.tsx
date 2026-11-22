import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Check, ChevronDown, ShoppingBag } from 'lucide-react';
import type{ PageId, Product } from '../types';
import { SERVICES, formatMoney } from '../data/storeData';
import { ArtSvg } from './ArtSvg';
import { ProductCard } from './ProductCard';
import { ShrineCanvas,type ShrineController } from './ShrineCanvas';
import { TransparentOrnament } from './TransparentOrnament';
import { HeroMovingAura, HeroShrineMandalaHalo } from './HeroMovingAura';
import { SacredFrameCard } from './SacredFrameCard';

const ASSET_LANTERNS = '/assets/aistudio/Timeless_Vintage_Elements__Elegant_Png_Collection_d4ac87e7.jpeg';
const ASSET_CORNER_MANDALA = '/assets/aistudio/download__3__9ee8cd16.jpeg';
const ASSET_ARCH_BORDER = '/assets/aistudio/download__2__d5cebe3a.jpeg';

gsap.registerPlugin(ScrollTrigger);

interface HomePageProps {
  products: Product[];
  onAddCart: (id: number) => void;
  onOpenService: (name: string) => void;
  onNavigate: (page: PageId) => void;
  onGoShop: () => void;
  onFilterShop: (category: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  onAddCart,
  onOpenService,
  onNavigate,
  onGoShop,
  onFilterShop,
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const heroShrineRef = useRef<ShrineController | null>(null);
  const cinemaShrineRef = useRef<ShrineController | null>(null);

  const cinemaTrackRef = useRef<HTMLDivElement | null>(null);
  const cinemaCopyRef = useRef<HTMLDivElement | null>(null);
  const cinemaStarsRef = useRef<HTMLDivElement | null>(null);
  const cinemaHaloRef = useRef<HTMLDivElement | null>(null);
  const cinemaBarRef = useRef<HTMLSpanElement | null>(null);

  const lanternLeftRef = useRef<HTMLDivElement | null>(null);
  const lanternRightRef = useRef<HTMLDivElement | null>(null);
  const cornerLeftRef = useRef<HTMLDivElement | null>(null);
  const cornerRightRef = useRef<HTMLDivElement | null>(null);
  const archLeftRef = useRef<HTMLDivElement | null>(null);
  const archRightRef = useRef<HTMLDivElement | null>(null);
  const heroMandalaOuterRef = useRef<SVGSVGElement | null>(null);
  const heroMandalaInnerRef = useRef<SVGSVGElement | null>(null);

  const [litStep, setLitStep] = useState(0);

  const featuredThali = products.find((p) => p.id === 2) || products[1] || products[0];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setLitStep(2);
      cinemaShrineRef.current?.setProgress(1);
      if (cinemaBarRef.current) cinemaBarRef.current.style.transform = 'scaleX(1)';
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Center-Outward Hero Text Emergence + Background 3D Diya Entrance
      gsap.fromTo(
        '.hero-bg-diya',
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.45, ease: 'power2.out', clearProps: 'opacity' }
      );

      // Gentle ambient drift of the 3D Diya background layer
      gsap.to('.hero-bg-diya-float', {
        y: -14,
        x: 10,
        duration: 6.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });

      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      heroTl
        .from('.hero-emerge-core', {
          scale: 0.72,
          opacity: 0,
          filter: 'blur(12px)',
          duration: 1.15,
          transformOrigin: 'center center',
          clearProps: 'transform,opacity,filter',
        })
        .from(
          '.hero-emerge-rule',
          {
            scaleX: 0,
            opacity: 0,
            duration: 0.8,
            transformOrigin: 'center center',
            clearProps: 'transform,opacity',
          },
          '-=0.8'
        )
        .from(
          '.hero-emerge-up',
          {
            y: 34,
            scale: 0.88,
            opacity: 0,
            duration: 0.95,
            stagger: 0.09,
            transformOrigin: 'center center',
            clearProps: 'transform,opacity',
          },
          '-=0.88'
        )
        .from(
          '.hero-emerge-down',
          {
            y: -26,
            scale: 0.92,
            opacity: 0,
            duration: 0.95,
            stagger: 0.09,
            transformOrigin: 'center center',
            clearProps: 'transform,opacity',
          },
          '-=0.82'
        );

      // 2. Hero Scroll Parallax — Background 3D Diya moves & scrubs while centered copy lifts away
      ScrollTrigger.create({
        trigger: '.hero-stage',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.05,
        onUpdate: (self) => {
          heroShrineRef.current?.setProgress(self.progress);
        },
      });

      gsap.to('.hero-bg-diya', {
        yPercent: 12,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-stage',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.15,
        },
      });

      gsap.to('.hero-copy-col', {
        yPercent: -10,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-stage',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.1,
        },
      });

      // 2a. Sacred Mandala Halo behind Hero 3D Shrine — continuous counter-orbit + scroll twist
      if (heroMandalaOuterRef.current && heroMandalaInnerRef.current) {
        gsap.to(heroMandalaOuterRef.current, {
          rotation: 360,
          duration: 68,
          repeat: -1,
          ease: 'none',
        });
        gsap.to(heroMandalaInnerRef.current, {
          rotation: -360,
          duration: 44,
          repeat: -1,
          ease: 'none',
        });
        gsap.fromTo(
          '.hero-mandala-wrap',
          { scale: 0.92, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.3,
            delay: 0.2,
            ease: 'power3.out',
          }
        );
        gsap.to('.hero-mandala-wrap', {
          yPercent: -10,
          scale: 1.08,
          rotation: 28,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero-stage',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.25,
          },
        });
      }

      // 2b. Hanging Vintage Brass Lanterns — entrance drop, pendulum sway & scroll parallax
      if (lanternLeftRef.current && lanternRightRef.current) {
        gsap.from([lanternLeftRef.current, lanternRightRef.current], {
          y: -52,
          opacity: 0,
          duration: 1.2,
          stagger: 0.14,
          ease: 'power3.out',
          clearProps: 'opacity',
        });

        gsap.fromTo(
          lanternLeftRef.current,
          { y: 0, rotation: -1.8 },
          {
            y: 78,
            rotation: 4.2,
            ease: 'none',
            scrollTrigger: {
              trigger: '.hero-stage',
              start: 'top top',
              end: 'bottom top',
              scrub: 1.25,
            },
          }
        );

        gsap.fromTo(
          lanternRightRef.current,
          { y: 0, rotation: 1.6 },
          {
            y: 54,
            rotation: -3.6,
            ease: 'none',
            scrollTrigger: {
              trigger: '.hero-stage',
              start: 'top top',
              end: 'bottom top',
              scrub: 1.35,
            },
          }
        );
      }

      // 2c. Illuminated Corner Mandalas — symmetrical bloom on #services scroll
      if (cornerLeftRef.current && cornerRightRef.current) {
        gsap.fromTo(
          cornerLeftRef.current,
          { x: -42, y: -32, scale: 0.82, opacity: 0.08 },
          {
            x: 0,
            y: 0,
            scale: 1.04,
            opacity: 0.46,
            ease: 'none',
            scrollTrigger: {
              trigger: '#services',
              start: 'top 92%',
              end: 'center center',
              scrub: 1.15,
            },
          }
        );

        gsap.fromTo(
          cornerRightRef.current,
          { x: 42, y: -32, scale: 0.82, opacity: 0.08 },
          {
            x: 0,
            y: 0,
            scale: 1.04,
            opacity: 0.46,
            ease: 'none',
            scrollTrigger: {
              trigger: '#services',
              start: 'top 92%',
              end: 'center center',
              scrub: 1.15,
            },
          }
        );
      }

      // 3. Staggered Reveal for Cards & Blocks
      gsap.utils.toArray<HTMLElement>('.gsap-reveal').forEach((el, idx) => {
        gsap.from(el, {
          y: 24,
          opacity: 0,
          duration: 0.75,
          delay: (idx % 4) * 0.05,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        });
      });

      // 4. Smooth Artwork Parallax inside cards & spotlight
      gsap.utils.toArray<HTMLElement>('[data-parallax-art]').forEach((artEl) => {
        gsap.fromTo(
          artEl,
          { yPercent: 6 },
          {
            yPercent: -6,
            ease: 'none',
            scrollTrigger: {
              trigger: artEl.parentElement || artEl,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      });

      // 5. Proof Counter Animation
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const targetVal = Number(el.dataset.count || '0');
        const suffix = el.dataset.suffix || '';
        const decimals = Number(el.dataset.decimals || '0');
        const state = { val: 0 };
        gsap.to(state, {
          val: targetVal,
          duration: 1.35,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            once: true,
          },
          onUpdate: () => {
            el.textContent =
              (decimals > 0
                ? state.val.toFixed(decimals)
                : Math.round(state.val).toLocaleString('en-IN')) + suffix;
          },
        });
      });

      // 6. Pinned / Sticky GSAP Scrubbed Cinematic Ritual Scene
      if (cinemaTrackRef.current) {
        ScrollTrigger.create({
          trigger: cinemaTrackRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.85,
          onUpdate: (self) => {
            const p = self.progress;
            cinemaShrineRef.current?.setProgress(p);

            const stepIndex = p < 0.36 ? 0 : p < 0.68 ? 1 : 2;
            setLitStep(stepIndex);

            if (cinemaStarsRef.current) {
              gsap.set(cinemaStarsRef.current, {
                y: p * -90,
                scale: 1 + p * 0.16,
                opacity: 0.25 + p * 0.65,
              });
            }

            if (cinemaHaloRef.current) {
              const glowT = Math.min(1, Math.max(0, (p - 0.12) / 0.72));
              gsap.set(cinemaHaloRef.current, {
                opacity: 0.18 + glowT * 0.82,
                scale: 0.74 + glowT * 0.52,
              });
            }

            if (cinemaCopyRef.current) {
              const copyT = Math.min(1, p / 0.32);
              const eased = 1 - Math.pow(1 - copyT, 3);
              gsap.set(cinemaCopyRef.current, {
                opacity: 0.25 + eased * 0.75,
                y: (1 - eased) * 20,
              });
            }

            if (cinemaBarRef.current) {
              gsap.set(cinemaBarRef.current, { scaleX: p });
            }

            // Carved geometric arch borders glide inward like temple doors opening onto the altar
            const archT = Math.min(1, Math.max(0, p / 0.72));
            const archEase = 1 - Math.pow(1 - archT, 2.4);
            if (archLeftRef.current) {
              gsap.set(archLeftRef.current, {
                xPercent: -42 + archEase * 42,
                yPercent: -6 + p * 10,
                opacity: 0.08 + archEase * 0.44,
              });
            }
            if (archRightRef.current) {
              gsap.set(archRightRef.current, {
                xPercent: 42 - archEase * 42,
                yPercent: -6 + p * 10,
                opacity: 0.08 + archEase * 0.44,
              });
            }
          },
        });
      }
    }, root);

    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 160);
    return () => {
      window.clearTimeout(refreshId);
      ctx.revert();
    };
  }, []);

  const scrollToServices = () => {
    const el = document.getElementById('services');
    if (!el) return;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 76,
      behavior: 'smooth',
    });
  };

  return (
    <div ref={rootRef}>
      {/* HERO SECTION */}
      <div className="hero-stage relative flex min-h-[calc(100svh-var(--header))] items-center justify-center overflow-hidden">
        <HeroMovingAura />

        {/* 3D Diya Moving in the Background (Unboxed Full-Stage Sanctuary) */}
        <div
          aria-hidden="true"
          className="hero-bg-diya pointer-events-none absolute inset-0 z-[1] flex items-center justify-center will-change-transform"
        >
          <div className="hero-mandala-wrap pointer-events-none absolute inset-0 flex items-center justify-center will-change-transform">
            <div className="relative h-[min(86vw,340px)] w-[min(86vw,340px)] sm:h-[580px] sm:w-[580px] lg:h-[740px] lg:w-[740px]">
              <HeroShrineMandalaHalo
                outerRef={heroMandalaOuterRef}
                innerRef={heroMandalaInnerRef}
              />
            </div>
          </div>

          <span className="anim-flicker pointer-events-none absolute left-1/2 top-[43%] h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(247,202,107,0.34)_0%,rgba(204,62,38,0.36)_46%,transparent_72%)] blur-2xl sm:top-[44%] sm:h-[380px] sm:w-[380px] lg:h-[460px] lg:w-[460px]" />

          <div className="hero-bg-diya-float h-full w-full will-change-transform">
            <ShrineCanvas
              backgroundMode
              autolight
              interactive={false}
              fit={0.86}
              targetY={-0.14}
              onReady={(ctrl) => {
                heroShrineRef.current = ctrl;
              }}
              className="h-full w-full opacity-90"
            />
          </div>
        </div>

        {/* Soft Contrast Veil Between Moving 3D Diya and Centered Foreground Typography */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_58%_48%_at_50%_54%,rgba(6,37,41,0.74)_0%,rgba(8,51,57,0.36)_58%,transparent_100%)]"
        />

        {/* Hanging Vintage Brass Lanterns — Scroll-Scrubbed Pendulums */}
        <div
          ref={lanternLeftRef}
          aria-hidden="true"
          className="pointer-events-none absolute -top-2 -left-10 z-[3] hidden w-[128px] origin-top select-none opacity-30 md:block lg:-left-6 lg:w-[152px] lg:opacity-45 xl:left-0 xl:opacity-65 2xl:left-[max(1rem,calc((100vw-1420px)/2))] 2xl:w-[184px] 2xl:opacity-80 will-change-transform"
        >
          <span className="pointer-events-none absolute bottom-[22%] left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(247,202,107,0.34),transparent_68%)] blur-xl" />
          <TransparentOrnament
            src={ASSET_LANTERNS}
            mode="checker-edge"
            crop={{ x: 0.04, y: 0, w: 0.47, h: 0.98 }}
            className="h-auto w-full drop-shadow-[0_24px_34px_rgba(0,0,0,0.75)]"
          />
        </div>

        <div
          ref={lanternRightRef}
          aria-hidden="true"
          className="pointer-events-none absolute -top-2 -right-8 z-[3] hidden w-[122px] origin-top select-none opacity-30 md:block lg:-right-5 lg:w-[144px] lg:opacity-45 xl:right-1 xl:opacity-65 2xl:right-[max(1rem,calc((100vw-1420px)/2))] 2xl:w-[172px] 2xl:opacity-80 will-change-transform"
        >
          <span className="pointer-events-none absolute bottom-[26%] left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(247,202,107,0.34),transparent_68%)] blur-xl" />
          <TransparentOrnament
            src={ASSET_LANTERNS}
            mode="checker-edge"
            crop={{ x: 0.52, y: 0, w: 0.46, h: 0.74 }}
            className="h-auto w-full drop-shadow-[0_24px_34px_rgba(0,0,0,0.75)]"
          />
        </div>

        {/* Centered Hero Content Emerging from the Middle */}
        <section className="hero-section relative z-10 mx-auto flex w-full max-w-[820px] flex-col items-center px-4 py-12 text-center sm:px-10 sm:py-24 lg:py-28">
          <div className="hero-copy-col flex flex-col items-center will-change-transform">
            <button
              type="button"
              onClick={() => onOpenService('Aaj Ki Pooja')}
              className="hero-emerge-up mb-4 inline-flex items-center gap-2 border-b border-[var(--clay)]/30 pb-1.5 text-[10.5px] font-medium uppercase tracking-[0.16em] text-[var(--clay-2)] transition-colors hover:border-[var(--clay)] sm:mb-5 sm:gap-2.5 sm:text-[11px] sm:tracking-[0.18em]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--sage)]" />
              <span>LIVE · Aaj Ki Pooja · from ₹101</span>
            </button>

            <p className="hero-emerge-up mb-3.5 flex items-center justify-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-2)]/80 sm:mb-4 sm:gap-3 sm:text-[11px] sm:tracking-[0.18em]">
              <span className="h-px w-4 bg-[var(--line-2)] sm:w-5" aria-hidden="true" />
              <span>Live pooja service · 12 cities</span>
              <span className="h-px w-4 bg-[var(--line-2)] sm:w-5" aria-hidden="true" />
            </p>

            <h1 className="hero-emerge-core font-serif-display text-balance text-[clamp(36px,9.2vw,84px)] font-normal leading-[0.98] tracking-[-0.025em] text-[var(--ink)] drop-shadow-[0_8px_28px_rgba(0,0,0,0.75)] sm:leading-[0.95]">
              A pandit at your door.
              <br />
              Or on your <em className="italic text-[var(--clay)]">screen.</em>
            </h1>

            <span
              className="hero-emerge-rule mt-5 block h-px w-20 bg-gradient-to-r from-transparent via-[var(--clay)]/70 to-transparent sm:mt-6 sm:w-24"
              aria-hidden="true"
            />

            <p className="hero-emerge-down text-pretty mt-4 max-w-[46ch] text-[14px] leading-[1.68] text-[var(--ink-2)] sm:mt-6 sm:max-w-[50ch] sm:text-[17px] sm:leading-[1.72]">
              Aaj Ki Pooja on video, a pandit for the big day, prasad from Kamakhya, or Ganga Jal
              filmed at the ghat. Book and pay in under a minute, and keep the recording.
            </p>

            <div className="hero-emerge-down mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-8 sm:gap-5">
              <button
                type="button"
                onClick={() => onOpenService('Aaj Ki Pooja')}
                className="btn-gold inline-flex min-h-[44px] items-center gap-2 rounded-xl px-5 text-[13.5px] tracking-[0.01em] transition-transform active:translate-y-px sm:min-h-[46px] sm:px-6 sm:text-[14px]"
              >
                <span>Book a pooja</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={scrollToServices}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-3 text-[13.5px] font-medium text-[var(--ink-2)] transition-colors hover:text-[var(--clay)] sm:min-h-[46px] sm:text-[14px]"
              >
                <span>See all services</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <ul className="hero-emerge-down mt-8 flex flex-wrap justify-center gap-x-4 gap-y-1.5 border-t border-[var(--line)] pt-4 text-[11.5px] text-[var(--muted)] sm:mt-10 sm:gap-x-6 sm:pt-5 sm:text-[12.5px]">
              <li>2,400+ poojas performed</li>
              <li aria-hidden="true">·</li>
              <li>Instant confirmation</li>
              <li aria-hidden="true">·</li>
              <li>Live on video</li>
            </ul>
          </div>
        </section>
      </div>

      {/* SIGNATURE SERVICES BAND */}
      <section
        id="services"
        className="relative overflow-hidden border-y border-[var(--line)] bg-[radial-gradient(110%_90%_at_80%_-20%,rgba(204,62,38,0.44),transparent_58%),linear-gradient(180deg,rgba(12,67,75,0.92),rgba(6,37,41,0.94))] py-14 backdrop-blur-[2px] sm:py-20"
      >
        {/* Illuminated Corner Mandalas — Symmetrical Scroll Bloom */}
        <div
          ref={cornerLeftRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-0 w-[160px] origin-top-left select-none opacity-25 sm:w-[240px] lg:w-[310px] will-change-transform"
        >
          <TransparentOrnament
            src={ASSET_CORNER_MANDALA}
            mode="white-edge"
            className="h-auto w-full -scale-x-100 drop-shadow-[0_18px_36px_rgba(0,0,0,0.8)]"
          />
        </div>
        <div
          ref={cornerRightRef}
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 z-0 w-[160px] origin-top-right select-none opacity-25 sm:w-[240px] lg:w-[310px] will-change-transform"
        >
          <TransparentOrnament
            src={ASSET_CORNER_MANDALA}
            mode="white-edge"
            className="h-auto w-full drop-shadow-[0_18px_36px_rgba(0,0,0,0.8)]"
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1220px] px-5 sm:px-10 lg:px-12">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                <span className="h-px w-6 bg-[var(--line-2)]" aria-hidden="true" />
                <span>
                  Our speciality · <span className="font-deva text-[13px] normal-case tracking-normal">आज की पूजा</span>
                </span>
              </p>
              <h2 className="font-serif-display text-balance text-[clamp(32px,3.8vw,46px)] font-normal leading-[1.04] tracking-[-0.015em] text-[var(--ink)]">
                Choose your ritual.
              </h2>
              <p className="mt-3.5 max-w-[54ch] text-[14.5px] leading-[1.65] text-[var(--ink-2)]">
                Aaj Ki Pooja, pandit booking, Kamakhya prasad and Ganga Jal films. Pick a date, pay,
                and the booking is confirmed instantly, with photos or a recording afterwards.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <span className="text-[12px] font-medium text-[var(--sage)]">
                Live on video · Instant confirmation
              </span>
              <button
                type="button"
                onClick={() => onNavigate('c-services')}
                className="btn-gold inline-flex min-h-[42px] items-center gap-2 rounded-xl px-5 text-[13.5px]"
              >
                <span>All services</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4">
            {SERVICES.map((svc, idx) => (
              <article key={svc.name} className="gsap-reveal group flex min-w-0 flex-col">
                <SacredFrameCard
                  className="aspect-[1/1.2]"
                  innerClassName={`tone-${svc.tone}`}
                >
                  <span className="absolute left-1/2 top-5 z-20 -translate-x-1/2 rounded-md bg-[#B82E1E]/92 px-2 py-0.5 text-[10px] font-medium tracking-[0.18em] text-[#FDF2DA] backdrop-blur-sm tabular-nums sm:top-6">
                    0{idx + 1}
                  </span>
                  {svc.image ? (
                    <>
                      <div
                        data-parallax-art
                        className="absolute -inset-y-[8%] inset-x-0 overflow-hidden will-change-transform"
                      >
                        <img
                          src={svc.image}
                          alt={svc.name}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          className="h-full w-full scale-[1.04] object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.1]"
                        />
                      </div>
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#051B1F]/65 via-transparent via-45% to-[#051B1F]/86"
                      />
                    </>
                  ) : (
                    <div
                      data-parallax-art
                      className="flex h-full w-full items-center justify-center py-4 will-change-transform"
                    >
                      <ArtSvg
                        name={svc.art}
                        className="w-[46%] text-[#FDF2DA] transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => onOpenService(svc.name)}
                    className="absolute bottom-3.5 left-1/2 z-30 min-h-[28px] -translate-x-1/2 rounded-lg border border-[#FDF2DA]/35 bg-[#083339]/92 px-3 text-[11px] font-medium text-[#FDF2DA] backdrop-blur-md transition-colors hover:border-[#FDF2DA] hover:bg-[#B82E1E] hover:text-[#FDF2DA] sm:bottom-5 sm:min-h-[32px] sm:px-3.5 sm:text-[12px]"
                  >
                    Book
                  </button>
                </SacredFrameCard>
                <div className="mt-2.5 flex flex-1 flex-col gap-1 px-0.5 sm:mt-3 sm:px-1">
                  <span className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)] sm:text-[10px] sm:tracking-[0.14em]">
                    {svc.k}
                  </span>
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-2">
                    <h3 className="font-serif-display text-[18px] font-normal leading-tight text-[var(--ink)] sm:text-[21px]">
                      {svc.name}
                    </h3>
                    <span className="shrink-0 text-[11.5px] font-semibold text-[var(--clay-2)] tabular-nums sm:text-[12.5px]">
                      from {formatMoney(svc.price)}
                    </span>
                  </div>
                  <p className="text-[12px] leading-relaxed text-[var(--muted)] sm:text-[12.5px]">{svc.desc}</p>
                </div>
              </article>
            ))}
          </div>

          <ul className="mt-8 grid grid-cols-2 gap-y-4 border-t border-[var(--line)] pt-5 sm:grid-cols-4 sm:gap-y-5 sm:pt-6">
            <li className="pr-3 sm:border-r sm:border-[var(--line)] sm:pr-4">
              <strong
                data-count="2400"
                data-suffix="+"
                className="font-serif-display block text-[24px] font-normal leading-none text-[var(--clay-2)] tabular-nums sm:text-[28px]"
              >
                2,400+
              </strong>
              <span className="mt-1 block text-[11px] tracking-[0.03em] text-[var(--muted)] sm:text-[11.5px]">
                poojas performed
              </span>
            </li>
            <li className="border-l border-[var(--line)] pl-3 sm:border-l-0 sm:border-r sm:pl-5 sm:pr-4">
              <strong
                data-count="4.9"
                data-decimals="1"
                className="font-serif-display block text-[24px] font-normal leading-none text-[var(--clay-2)] tabular-nums sm:text-[28px]"
              >
                4.9
              </strong>
              <span className="mt-1 block text-[11px] tracking-[0.03em] text-[var(--muted)] sm:text-[11.5px]">
                average rating
              </span>
            </li>
            <li className="border-t border-[var(--line)] pr-3 pt-4 sm:border-r sm:border-t-0 sm:pl-5 sm:pr-4 sm:pt-0">
              <strong
                data-count="12"
                className="font-serif-display block text-[24px] font-normal leading-none text-[var(--clay-2)] tabular-nums sm:text-[28px]"
              >
                12
              </strong>
              <span className="mt-1 block text-[11px] tracking-[0.03em] text-[var(--muted)] sm:text-[11.5px]">
                cities covered
              </span>
            </li>
            <li className="border-l border-t border-[var(--line)] pl-3 pt-4 sm:border-l-0 sm:border-t-0 sm:pl-5 sm:pt-0">
              <strong
                data-count="48"
                data-suffix="h"
                className="font-serif-display block text-[24px] font-normal leading-none text-[var(--clay-2)] tabular-nums sm:text-[28px]"
              >
                48h
              </strong>
              <span className="mt-1 block text-[11px] tracking-[0.03em] text-[var(--muted)] sm:text-[11.5px]">
                prasad dispatch
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* GSAP SCROLL-DRIVEN CINEMATIC RITUAL SCENE */}
      <section id="cinema" className="relative border-b border-[var(--line)] bg-[#062529]/90">
        <div ref={cinemaTrackRef} className="relative h-[260vh] lg:h-[310vh]">
          <div className="sticky top-0 grid h-[100svh] min-h-[560px] place-items-center overflow-hidden">
            <div className="pointer-events-none absolute -inset-[10%] bg-[radial-gradient(52%_46%_at_50%_62%,rgba(204,62,38,0.42),transparent_68%),radial-gradient(70%_60%_at_50%_118%,rgba(15,164,158,0.42),transparent_70%),rgba(6,37,41,0.74)]" />
            <div
              ref={cinemaStarsRef}
              className="cinema-stars pointer-events-none absolute inset-0 opacity-45 will-change-transform"
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_50%,transparent_34%,rgba(6,37,41,0.88)_78%)]" />

            {/* Carved Geometric Arch Borders — Scroll-Scrubbed Threshold Framing */}
            <div
              ref={archLeftRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-[-8%] -left-10 z-[2] hidden w-[140px] select-none opacity-20 md:block lg:-left-6 lg:w-[190px] xl:left-0 xl:w-[235px] 2xl:w-[270px] will-change-transform"
            >
              <TransparentOrnament
                src={ASSET_ARCH_BORDER}
                mode="white-edge"
                className="h-full w-full -scale-x-100 object-cover object-left drop-shadow-[16px_0_40px_rgba(0,0,0,0.85)]"
              />
            </div>
            <div
              ref={archRightRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-[-8%] -right-10 z-[2] hidden w-[140px] select-none opacity-20 md:block lg:-right-6 lg:w-[190px] xl:right-0 xl:w-[235px] 2xl:w-[270px] will-change-transform"
            >
              <TransparentOrnament
                src={ASSET_ARCH_BORDER}
                mode="white-edge"
                className="h-full w-full object-cover object-right drop-shadow-[-16px_0_40px_rgba(0,0,0,0.85)]"
              />
            </div>

            <div className="relative z-10 mx-auto grid w-full max-w-[1220px] grid-cols-1 items-center gap-3 px-4 pb-12 pt-4 sm:gap-6 sm:px-10 sm:py-0 lg:grid-cols-[0.94fr_1.06fr] lg:gap-16 lg:px-12">
              <div ref={cinemaCopyRef} className="order-2 lg:order-1 will-change-transform">
                <p className="mb-2 flex items-center gap-3 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)] sm:mb-3 sm:text-[11px]">
                  <span className="h-px w-6 bg-[var(--line-2)]" aria-hidden="true" />
                  <span>How a pooja happens</span>
                </p>
                <h2 className="font-serif-display text-balance text-[clamp(26px,6.8vw,56px)] font-normal leading-[1.02] text-[var(--ink)]">
                  From your tap
                  <br />
                  to the <em className="italic text-[var(--clay)]">altar.</em>
                </h2>
                <p className="mt-2.5 max-w-[44ch] text-[13px] leading-[1.6] text-[var(--ink-2)] sm:mt-3.5 sm:text-[15.5px] sm:leading-[1.7]">
                  One booking, three moments. You choose the ritual, we set up the lamp and the
                  offerings, and the pooja is performed while you watch, or recorded for later.
                </p>

                <div className="mt-4 max-w-[30rem] border-t border-[var(--clay)]/18 sm:mt-6">
                  {[
                    {
                      k: '01',
                      title: 'You choose',
                      desc: 'Date, time and city. Paid and confirmed in under a minute.',
                    },
                    {
                      k: '02',
                      title: 'We prepare',
                      desc: 'Lamp, flowers and prasad set up before the slot begins.',
                    },
                    {
                      k: '03',
                      title: 'It is performed',
                      desc: 'Live on video, or recorded and kept in My orders.',
                    },
                  ].map((step, i) => (
                    <div
                      key={step.k}
                      className={`grid grid-cols-[26px_1fr] items-baseline gap-2.5 border-b border-[var(--clay)]/12 py-2 transition-opacity duration-500 sm:grid-cols-[30px_1fr] sm:gap-3 sm:py-3 ${
                        i <= litStep ? 'opacity-100' : 'opacity-30'
                      }`}
                    >
                      <span className="text-[10px] font-medium tracking-[0.16em] text-[var(--clay)] tabular-nums sm:text-[10.5px]">
                        {step.k}
                      </span>
                      <div>
                        <strong className="block text-[13px] font-semibold text-[var(--ink)] sm:text-[13.5px]">
                          {step.title}
                        </strong>
                        <span className="mt-0.5 block text-[11.5px] leading-snug text-[var(--muted)] sm:text-[12px]">
                          {step.desc}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="relative order-1 grid h-[175px] place-items-center sm:h-[250px] lg:order-2 lg:h-auto lg:aspect-square"
                aria-hidden="true"
              >
                <span
                  ref={cinemaHaloRef}
                  className="pointer-events-none absolute aspect-square w-[112px] rounded-full bg-[radial-gradient(circle,rgba(247,202,107,0.36),rgba(204,62,38,0.34)_50%,transparent_68%)] blur-xl sm:w-[160px] lg:w-[60%]"
                />
                <div className="cinema-shrine-mask pointer-events-none absolute -inset-[6%] z-10">
                  <ShrineCanvas
                    interactive={false}
                    scrollDriven
                    fit={1.16}
                    targetY={0.9}
                    onReady={(ctrl) => {
                      cinemaShrineRef.current = ctrl;
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              className="pointer-events-none absolute bottom-6 left-5 z-20 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--muted)] sm:left-10 lg:left-12"
              aria-hidden="true"
            >
              <span className="hidden sm:inline">The ritual</span>
              <span className="h-[2px] w-[100px] overflow-hidden rounded-full bg-white/15 sm:w-[150px]">
                <span
                  ref={cinemaBarRef}
                  className="block h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[var(--clay)] to-[var(--clay-2)]"
                />
              </span>
            </div>

            <div
              className="pointer-events-none absolute bottom-6 right-5 z-20 hidden items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--muted)] sm:right-10 sm:flex lg:right-12"
              aria-hidden="true"
            >
              <span>Scroll</span>
              <ChevronDown className="h-3.5 w-3.5 animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* SHOP BY RITUAL */}
      <section className="mx-auto w-full max-w-[1220px] px-4 py-12 sm:px-10 sm:py-20 lg:px-12">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
          <div>
            <p className="mb-2.5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              <span className="h-px w-6 bg-[var(--line-2)]" aria-hidden="true" />
              <span>Start here</span>
            </p>
            <h2 className="font-serif-display text-balance text-[clamp(28px,6.8vw,44px)] font-normal leading-[1.04] tracking-[-0.015em] text-[var(--ink)]">
              Shop by ritual
            </h2>
          </div>
          <button
            type="button"
            onClick={onGoShop}
            className="group inline-flex items-center gap-2 text-[13.5px] font-medium text-[var(--ink-2)] transition-colors hover:text-[var(--clay)]"
          >
            <span>All products</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {[
            {
              idx: '01',
              title: 'Pooja essentials',
              desc: 'Lamps, thalis, bells and the everyday things the altar asks for.',
              art: 'kalash' as const,
              image: '/src/assets/images/copper_kalash_1795337828324.jpg',
              tone: 'sand',
              onClick: () => onFilterShop('Pooja Essentials'),
            },
            {
              idx: '02',
              title: 'Spiritual wellness',
              desc: 'Malas and quiet objects for japa, meditation and rest.',
              art: 'mala' as const,
              image: '/src/assets/images/rudraksha_mala_1795337828820.jpg',
              tone: 'sage',
              onClick: () => onFilterShop('Spiritual Wellness'),
            },
            {
              idx: '03',
              title: 'Gifts & hampers',
              desc: 'For housewarmings, first poojas and people you love.',
              art: 'gift' as const,
              image: '/src/assets/images/divine_gift_box_1795337828537.jpg',
              tone: 'stone',
              onClick: () => onFilterShop('Gifts'),
            },
            {
              idx: '04',
              title: 'Divine services',
              desc: 'Poojas at home or on video, booked with a real person.',
              art: 'namaste' as const,
              image: '/src/assets/images/aaj_ki_pooja_1795337828522.jpg',
              tone: 'rose',
              onClick: () => onNavigate('c-services'),
            },
          ].map((item) => (
            <button
              key={item.idx}
              type="button"
              onClick={item.onClick}
              className="gsap-reveal group flex flex-col text-left"
            >
              <SacredFrameCard
                className="aspect-[1/1.2] w-full"
                innerClassName={`tone-${item.tone}`}
              >
                <div
                  data-parallax-art
                  className="absolute -inset-y-[8%] inset-x-0 overflow-hidden will-change-transform"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="h-full w-full scale-[1.04] object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.1]"
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#051B1F]/40 via-transparent via-50% to-[#051B1F]/76"
                />
              </SacredFrameCard>
              <span className="mt-2.5 flex items-center gap-1.5 sm:mt-3 sm:items-baseline sm:gap-2.5">
                <span className="shrink-0 text-[10px] font-medium tracking-[0.1em] text-[var(--muted)] tabular-nums sm:text-[10.5px]">
                  {item.idx}
                </span>
                <span className="min-w-0 text-[13px] font-semibold leading-tight text-[var(--ink)] sm:text-[14.5px]">
                  {item.title}
                </span>
                <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-[var(--muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--clay)]" />
              </span>
              <span className="mt-1 hidden text-[12.5px] leading-relaxed text-[var(--muted)] sm:block">
                {item.desc}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED SPOTLIGHT */}
      {featuredThali && (
        <section className="mx-auto w-full max-w-[1220px] px-4 pb-12 sm:px-10 sm:pb-20 lg:px-12">
          <div className="grid grid-cols-1 items-center gap-7 lg:grid-cols-[1.04fr_0.96fr] lg:gap-16">
            <SacredFrameCard
              className="gsap-reveal group mx-auto aspect-[1/1.16] w-full max-w-[330px] sm:max-w-[440px] lg:max-w-[460px]"
              innerClassName="tone-clay flex items-center justify-center"
            >
              <span className="absolute left-1/2 top-8 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#B82E1E]/92 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[#FDF2DA] backdrop-blur-sm">
                No. 02 · Serve
              </span>
              {featuredThali.image ? (
                <>
                  <div
                    data-parallax-art
                    className="absolute -inset-y-[8%] inset-x-0 overflow-hidden will-change-transform"
                  >
                    <img
                      src={featuredThali.image}
                      alt={featuredThali.name}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="h-full w-full scale-[1.04] object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                    />
                  </div>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#051B1F]/68 via-transparent via-45% to-[#051B1F]/78"
                  />
                </>
              ) : (
                <div
                  data-parallax-art
                  className="flex h-full w-full items-center justify-center will-change-transform"
                >
                  <ArtSvg name="thali" className="w-[48%] text-[#FDF2DA]" />
                </div>
              )}
            </SacredFrameCard>

            <div className="gsap-reveal">
              <p className="mb-2.5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                <span className="h-px w-6 bg-[var(--line-2)]" aria-hidden="true" />
                <span>The one we would gift</span>
              </p>
              <h2 className="font-serif-display text-balance text-[clamp(30px,3.6vw,44px)] font-normal leading-[1.04] tracking-[-0.015em] text-[var(--ink)]">
                A thali that lives on the shelf, not in the cupboard.
              </h2>
              <p className="mt-3.5 max-w-[46ch] text-[15px] leading-[1.68] text-[var(--ink-2)]">
                Handspun brass with a soft matte finish, five bowls and a centre lamp. Weighted so
                it sits still while you move around it, and shallow enough to wash in a normal
                sink.
              </p>
              <div className="my-5 flex items-baseline gap-3">
                <span className="text-[26px] font-semibold tracking-[-0.015em] text-[var(--ink)] tabular-nums">
                  {formatMoney(featuredThali.price)}
                </span>
                <span className="text-[14px] text-[var(--muted)] line-through tabular-nums">
                  {formatMoney(featuredThali.old)}
                </span>
                <span className="text-[12px] font-medium text-[var(--sage)]">· Save 20%</span>
              </div>
              <button
                type="button"
                onClick={() => onAddCart(featuredThali.id)}
                className="btn-gold inline-flex min-h-[44px] items-center gap-2 rounded-xl px-5 text-[14px]"
              >
                <span>Add to bag</span>
                <ShoppingBag className="h-4 w-4" />
              </button>
              <ul className="mt-6 space-y-2 border-t border-[var(--line)] pt-5 text-[13px] text-[var(--ink-2)]">
                {[
                  'Food-safe brass, no lacquer to flake off',
                  'Packed in a reusable cotton pouch and rigid box',
                  'Arrives polished, ready to use',
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--clay)]" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* MOST GIVEN THIS WEEK */}
      <section className="mx-auto w-full max-w-[1220px] px-4 pb-12 sm:px-10 sm:pb-20 lg:px-12">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
          <div>
            <p className="mb-2.5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              <span className="h-px w-6 bg-[var(--line-2)]" aria-hidden="true" />
              <span>Handpicked favourites</span>
            </p>
            <h2 className="font-serif-display text-balance text-[clamp(28px,6.8vw,44px)] font-normal leading-[1.04] tracking-[-0.015em] text-[var(--ink)]">
              Most given this week
            </h2>
          </div>
          <button
            type="button"
            onClick={onGoShop}
            className="group inline-flex items-center gap-2 text-[13.5px] font-medium text-[var(--ink-2)] transition-colors hover:text-[var(--clay)]"
          >
            <span>Shop all</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} onAdd={onAddCart} />
          ))}
        </div>
      </section>

      {/* CRAFT / STANDARDS */}
      <section className="mx-auto w-full max-w-[1220px] px-4 pb-14 sm:px-10 sm:pb-24 lg:px-12">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-2.5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              <span className="h-px w-6 bg-[var(--line-2)]" aria-hidden="true" />
              <span>What we actually do</span>
            </p>
            <h2 className="font-serif-display text-balance text-[clamp(30px,3.6vw,44px)] font-normal leading-[1.04] tracking-[-0.015em] text-[var(--ink)]">
              Small things, done properly.
            </h2>
          </div>
          <p className="max-w-[34ch] text-[13.5px] leading-relaxed text-[var(--muted)]">
            Everything below is how the studio prepares each piece before it reaches your home
            altar.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-10">
          {[
            {
              k: '01 · Quality',
              title: 'Opened before it ships',
              desc: 'Each brass piece is unwrapped, checked for dents and finish, then rewrapped. If it is not worth keeping, it does not go out.',
            },
            {
              k: '02 · Packing',
              title: 'Packed like it is going home',
              desc: 'Cotton wrap, rigid box, no plastic filler. Breakage is replaced without a conversation about courier fault.',
            },
            {
              k: '03 · People',
              title: 'A person answers',
              desc: 'Same team answers the phone and the inbox. If a date needs moving, a person sorts it out without a ticket queue.',
            },
          ].map((item) => (
            <div
              key={item.k}
              className="gsap-reveal border-t border-[var(--line-2)] pt-4"
            >
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                {item.k}
              </span>
              <h3 className="font-serif-display mt-2.5 text-[24px] font-normal leading-tight text-[var(--ink)]">
                {item.title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-[1.65] text-[var(--muted)]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
