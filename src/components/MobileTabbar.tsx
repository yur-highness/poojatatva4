import React from 'react';
import { Home, Receipt, ShoppingBag, Sparkles, User } from 'lucide-react';
import {type PageId } from '../types';

interface MobileTabbarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  onGoShop: () => void;
}

export const MobileTabbar: React.FC<MobileTabbarProps> = ({
  activePage,
  onNavigate,
  onGoShop,
}) => {
  if (activePage === 'admin-app') return null;

  const tabs: Array<{
    id: PageId;
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
    action: () => void;
  }> = [
    { id: 'c-home', label: 'Home', Icon: Home, action: () => onNavigate('c-home') },
    { id: 'c-services', label: 'Services', Icon: Sparkles, action: () => onNavigate('c-services') },
    { id: 'c-shop', label: 'Shop', Icon: ShoppingBag, action: onGoShop },
    { id: 'c-orders', label: 'Orders', Icon: Receipt, action: () => onNavigate('c-orders') },
    { id: 'c-account', label: 'Account', Icon: User, action: () => onNavigate('c-account') },
  ];

  return (
    <nav
      aria-label="Store sections"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-[var(--line)] bg-[#083339]/95 px-1 pb-[calc(6px+env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-lg md:hidden"
    >
      {tabs.map(({ id, label, Icon, action }) => {
        const active = activePage === id;
        return (
          <button
            key={id}
            onClick={action}
            className={`grid flex-1 justify-items-center gap-0.5 rounded-lg py-1 text-[10px] font-medium transition-colors ${
              active ? 'text-[var(--clay)]' : 'text-[var(--muted)]'
            }`}
          >
            <Icon className="h-[19px] w-[19px]" />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
};
