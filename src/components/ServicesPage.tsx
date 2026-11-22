import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import { SERVICES, formatMoney } from '../data/storeData';
import { ArtSvg } from './ArtSvg';
import { SacredFrameCard } from './SacredFrameCard';

interface ServicesPageProps {
  onOpenService: (name: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onOpenService }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.from('.svc-reveal', {
        y: 22,
        opacity: 0,
        duration: 0.65,
        stagger: 0.07,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="mx-auto w-full max-w-[1220px] px-4 pb-16 pt-6 sm:px-10 sm:pb-20 sm:pt-12 lg:px-12"
    >
      <div className="pb-7 sm:pb-9">
        <p className="mb-2.5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          <span className="h-px w-6 bg-[var(--line-2)]" aria-hidden="true" />
          <span>Sacred experiences</span>
        </p>
        <h1 className="font-serif-display text-balance text-[clamp(30px,7vw,54px)] font-normal leading-[1.04] tracking-[-0.018em] text-[var(--ink)]">
          Bring the ritual home
        </h1>
        <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-[var(--muted)] sm:text-[14.5px]">
          Four services, booked and paid on one screen. Pick a date, pay, and it is confirmed
          instantly.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4">
        {SERVICES.map((svc) => (
          <article key={svc.name} className="svc-reveal group min-w-0">
            <SacredFrameCard
              className="aspect-[1/1.22]"
              innerClassName={`tone-${svc.tone}`}
            >
              <span className="absolute left-1/2 top-5 z-20 -translate-x-1/2 whitespace-nowrap rounded-md border border-[#FDF2DA]/25 bg-[#B82E1E]/92 px-2 py-0.5 text-[10px] font-semibold text-[#FDF2DA] backdrop-blur-sm tabular-nums sm:top-7 sm:px-2.5 sm:py-1 sm:text-[11px]">
                from {formatMoney(svc.price)}
              </span>
              {svc.image ? (
                <>
                  <div className="absolute inset-0 overflow-hidden">
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
                <div className="flex h-full w-full items-center justify-center py-4">
                  <ArtSvg
                    name={svc.art}
                    className="w-[46%] text-[#FDF2DA] transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() => onOpenService(svc.name)}
                aria-label={`Book ${svc.name}`}
                className="absolute bottom-3.5 left-1/2 z-30 inline-flex h-7 -translate-x-1/2 items-center gap-1 rounded-lg border border-[#FDF2DA]/35 bg-[#083339]/92 px-2.5 text-[11px] font-medium text-[#FDF2DA] backdrop-blur-md transition-colors hover:border-[#FDF2DA] hover:bg-[#B82E1E] hover:text-[#FDF2DA] sm:bottom-5 sm:h-8 sm:gap-1.5 sm:px-3.5 sm:text-[12px]"
              >
                <span>Book</span>
                <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </button>
            </SacredFrameCard>
            <div className="mt-2.5 sm:mt-3">
              <span className="block text-[9.5px] font-semibold uppercase tracking-[0.11em] text-[var(--muted)] sm:text-[10.5px] sm:tracking-[0.12em]">
                {svc.k}
              </span>
              <h2 className="font-serif-display mt-0.5 text-[18px] font-normal leading-tight text-[var(--ink)] sm:text-[21px]">
                {svc.name}
              </h2>
              <p className="mt-1 text-[12px] leading-relaxed text-[var(--muted)] sm:mt-1.5 sm:text-[12.5px]">{svc.desc}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-16 border-t border-[var(--line)] pt-12">
        <p className="mb-2.5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          <span className="h-px w-6 bg-[var(--line-2)]" aria-hidden="true" />
          <span>How it works</span>
        </p>
        <h2 className="font-serif-display text-[clamp(30px,3.6vw,42px)] font-normal leading-[1.06] text-[var(--ink)]">
          Three steps, one screen.
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-10">
          {[
            {
              k: 'Step one',
              title: 'Choose your ritual',
              desc: 'Pick the service, the date and the time slot. Everything you need is on one screen.',
            },
            {
              k: 'Step two',
              title: 'Pay and confirm',
              desc: 'UPI, card or netbanking. The booking is confirmed the moment payment clears.',
            },
            {
              k: 'Step three',
              title: 'It happens',
              desc: 'The pooja is performed, recorded or delivered as booked. The recording and receipt stay in My orders.',
            },
          ].map((step) => (
            <div key={step.k} className="svc-reveal border-t border-[var(--line-2)] pt-4">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                {step.k}
              </span>
              <h3 className="font-serif-display mt-2 text-[23px] font-normal text-[var(--ink)]">
                {step.title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--muted)]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
