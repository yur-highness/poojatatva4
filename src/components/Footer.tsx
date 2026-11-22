import React from 'react';
import {type PageId } from '../types';
import { ArtSvg } from './ArtSvg';

interface FooterProps {
  onNavigate: (page: PageId) => void;
  onGoShop: () => void;
  onFilterShop: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onGoShop,
  onFilterShop,
}) => {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--paper-2)] py-14 sm:py-16">
      <div className="mx-auto w-full max-w-[1220px] px-5 sm:px-10 lg:px-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-[1.65fr_1fr_1fr_1fr] lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('c-home');
              }}
              className="inline-flex items-center gap-2 text-[var(--ink)] no-underline"
            >
              <ArtSvg name="lotus" className="h-5 w-5 text-[var(--clay)]" />
              <span className="font-serif-display text-[21px] font-medium">PoojaTatva</span>
            </a>
            <p className="mt-3 max-w-[30ch] text-[13.5px] leading-relaxed text-[var(--muted)]">
              Pooja essentials, thoughtful gifts and devotional services for the way people
              actually practise at home.
            </p>
            <p className="font-deva mt-2.5 text-[15px] text-[var(--muted)]">श्रद्धा से, घर तक।</p>
          </div>

          <div>
            <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              Shop
            </h4>
            <ul className="space-y-1.5 text-[13.5px] text-[var(--ink-2)]">
              <li>
                <button
                  onClick={onGoShop}
                  className="py-1 text-left transition-colors hover:text-[var(--clay)]"
                >
                  All products
                </button>
              </li>
              <li>
                <button
                  onClick={() => onFilterShop('Pooja Essentials')}
                  className="py-1 text-left transition-colors hover:text-[var(--clay)]"
                >
                  Pooja essentials
                </button>
              </li>
              <li>
                <button
                  onClick={() => onFilterShop('Spiritual Wellness')}
                  className="py-1 text-left transition-colors hover:text-[var(--clay)]"
                >
                  Spiritual wellness
                </button>
              </li>
              <li>
                <button
                  onClick={() => onFilterShop('Gifts')}
                  className="py-1 text-left transition-colors hover:text-[var(--clay)]"
                >
                  Gifts
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              Services
            </h4>
            <ul className="space-y-1.5 text-[13.5px] text-[var(--ink-2)]">
              <li>
                <button
                  onClick={() => onNavigate('c-services')}
                  className="py-1 text-left transition-colors hover:text-[var(--clay)]"
                >
                  Aaj Ki Pooja
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('c-services')}
                  className="py-1 text-left transition-colors hover:text-[var(--clay)]"
                >
                  Pandit booking
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('c-services')}
                  className="py-1 text-left transition-colors hover:text-[var(--clay)]"
                >
                  Kamakhya prasad
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('c-services')}
                  className="py-1 text-left transition-colors hover:text-[var(--clay)]"
                >
                  Ganga Jal video
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              Help
            </h4>
            <ul className="space-y-1.5 text-[13.5px] text-[var(--ink-2)]">
              <li>
                <button
                  onClick={() => onNavigate('c-orders')}
                  className="py-1 text-left transition-colors hover:text-[var(--clay)]"
                >
                  Track an order
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('c-returns')}
                  className="py-1 text-left transition-colors hover:text-[var(--clay)]"
                >
                  Returns and refunds
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('c-support')}
                  className="py-1 text-left transition-colors hover:text-[var(--clay)]"
                >
                  Contact support
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('c-account')}
                  className="py-1 text-left transition-colors hover:text-[var(--clay)]"
                >
                  My account
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-5 text-[12px] text-[var(--muted)]">
          <span>© 2026 PoojaTatva · Demo build, no real payments are processed.</span>
          <span>Made with devotion and brass polish.</span>
        </div>
      </div>
    </footer>
  );
};
