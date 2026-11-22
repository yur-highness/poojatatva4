import React from 'react';
import { ShoppingBag, Volume2, VolumeX } from 'lucide-react';
import {type PageId } from '../types';
import { ArtSvg } from './ArtSvg';

interface HeaderProps {
  activePage: PageId;
  isScrolled: boolean;
  cartCount: number;
  soundOn: boolean;
  onNavigate: (page: PageId) => void;
  onGoShop: () => void;
  onSwitchView: (view: 'customer' | 'admin') => void;
  onToggleSound: () => void;
  onOpenBag: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  isScrolled,
  cartCount,
  soundOn,
  onNavigate,
  onGoShop,
  onSwitchView,
  onToggleSound,
  onOpenBag,
}) => {
  const isAdmin = activePage === 'admin-app';

  const navItems: Array<{ id: PageId; label: string; action: () => void }> = [
    { id: 'c-home', label: 'Home', action: () => onNavigate('c-home') },
    { id: 'c-services', label: 'Services', action: () => onNavigate('c-services') },
    { id: 'c-shop', label: 'Shop', action: onGoShop },
    { id: 'c-orders', label: 'Orders', action: () => onNavigate('c-orders') },
    { id: 'c-account', label: 'Account', action: () => onNavigate('c-account') },
  ];

  return (
    <header
      className={`sticky top-0 z-50 h-[var(--header)] transition-colors duration-300 border-b ${
        isScrolled
          ? 'bg-[#083339]/92 border-[var(--line)] backdrop-blur-xl'
          : 'bg-[#083339]/72 border-transparent backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between gap-2.5 px-3.5 sm:gap-6 sm:px-8 lg:px-12">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('c-home');
          }}
          className="flex shrink-0 items-center gap-2 whitespace-nowrap text-[var(--ink)] no-underline group sm:gap-2.5"
          aria-label="PoojaTatva home"
        >
          <ArtSvg
            name="lotus"
            className="h-5 w-5 text-[var(--clay)] transition-transform duration-500 group-hover:scale-105 sm:h-6 sm:w-6"
          />
          <span className="font-serif-display text-[19px] font-medium tracking-[0.01em] sm:text-[23px]">
            PoojaTatva
          </span>
        </a>

        {/* Zone 2: Minimal Single-Line Nav */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {navItems.map((item) => {
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`relative whitespace-nowrap shrink-0 py-1.5 text-[13.5px] font-medium tracking-[0.01em] transition-colors ${
                  active
                    ? 'text-[var(--ink)]'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                {item.label}
                <span
                  className={`absolute inset-x-0 -bottom-0.5 h-[1.5px] rounded-full bg-[var(--clay)] transition-transform duration-300 origin-left ${
                    active ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Quiet Actions */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <div
            className="flex items-center rounded-lg border border-[var(--line)] bg-[var(--paper-2)] p-0.5"
            role="group"
            aria-label="Workspace mode"
          >
            <button
              onClick={() => onSwitchView('customer')}
              className={`min-h-[28px] whitespace-nowrap shrink-0 rounded-md px-2 text-[11px] font-semibold transition-colors sm:min-h-[30px] sm:px-2.5 sm:text-[11.5px] ${
                !isAdmin
                  ? 'bg-[#B82E1E] text-[#FDF2DA]'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              Shop
            </button>
            <button
              onClick={() => onSwitchView('admin')}
              className={`min-h-[28px] whitespace-nowrap shrink-0 rounded-md px-2 text-[11px] font-semibold transition-colors sm:min-h-[30px] sm:px-2.5 sm:text-[11.5px] ${
                isAdmin
                  ? 'bg-[#B82E1E] text-[#FDF2DA]'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              Admin
            </button>
          </div>

          <button
            onClick={onToggleSound}
            aria-pressed={soundOn}
            aria-label={soundOn ? 'Mute ambient sound' : 'Play ambient sound'}
            className={`hidden sm:grid h-10 w-10 place-items-center rounded-full border transition-colors ${
              soundOn
                ? 'border-[var(--clay)]/45 bg-[var(--clay-soft)] text-[var(--clay-2)]'
                : 'border-transparent text-[var(--muted)] hover:bg-[var(--paper-2)] hover:text-[var(--ink)]'
            }`}
          >
            {soundOn ? <Volume2 className="h-[17px] w-[17px]" /> : <VolumeX className="h-[17px] w-[17px]" />}
          </button>

          <button
            onClick={onOpenBag}
            aria-label="Open shopping bag"
            className="relative grid h-9 w-9 place-items-center rounded-full text-[var(--ink-2)] transition-colors hover:bg-[var(--paper-2)] hover:text-[var(--ink)] sm:h-10 sm:w-10"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 top-0.5 grid min-w-[17px] h-[17px] place-items-center rounded-full bg-[var(--clay)] px-1 text-[10px] font-bold leading-none text-[var(--gold-ink)] tabular-nums">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
