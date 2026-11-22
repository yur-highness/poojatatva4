import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { PackageOpen } from 'lucide-react';
import {type Product } from '../types';
import { ProductCard } from './ProductCard';

interface ShopPageProps {
  products: Product[];
  categoryFilter: string;
  onCategoryChange: (cat: string) => void;
  onAddCart: (id: number) => void;
}

const CATEGORIES = ['all', 'Pooja Essentials', 'Spiritual Wellness', 'Gifts'];

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  categoryFilter,
  onCategoryChange,
  onAddCart,
}) => {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const filtered = products.filter(
    (p) => categoryFilter === 'all' || p.category === categoryFilter
  );

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.from('.gsap-reveal', {
        y: 18,
        opacity: 0,
        duration: 0.55,
        stagger: 0.045,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });
    }, el);
    return () => ctx.revert();
  }, [categoryFilter, products.length]);

  return (
    <section className="mx-auto w-full max-w-[1220px] px-4 pb-16 pt-6 sm:px-10 sm:pb-20 sm:pt-12 lg:px-12">
      <div className="flex flex-wrap items-end justify-between gap-5 pb-7 sm:gap-6 sm:pb-8">
        <div>
          <p className="mb-2.5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            <span className="h-px w-6 bg-[var(--line-2)]" aria-hidden="true" />
            <span>The collection</span>
          </p>
          <h1 className="font-serif-display text-balance text-[clamp(30px,7vw,54px)] font-normal leading-[1.04] tracking-[-0.018em] text-[var(--ink)]">
            Everything for the altar
          </h1>
          <p className="mt-3 max-w-[50ch] text-[14px] leading-relaxed text-[var(--muted)] sm:text-[14.5px]">
            Hand-checked pieces, each one chosen because we use it ourselves. Prices include GST.
          </p>
        </div>

        <div className="flex w-full items-center gap-1 overflow-x-auto rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-1 sm:w-auto sm:flex-wrap sm:gap-1.5">
          {CATEGORIES.map((cat) => {
            const active = categoryFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat)}
                className={`min-h-[34px] shrink-0 whitespace-nowrap rounded-lg px-3 text-[12px] font-medium transition-colors sm:px-3.5 sm:text-[12.5px] ${
                  active
                    ? 'bg-[#B82E1E] text-[#FDF2DA]'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                {cat === 'all' ? 'All categories' : cat}
              </button>
            );
          })}
        </div>
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4"
      >
        {filtered.length > 0 ? (
          filtered.map((p) => <ProductCard key={p.id} product={p} onAdd={onAddCart} />)
        ) : (
          <div className="col-span-full grid justify-items-center gap-2.5 py-16 text-center text-[var(--muted)]">
            <div className="grid h-16 w-16 place-items-center rounded-full border border-[var(--line)] bg-[var(--paper-2)] text-[var(--ink-2)]">
              <PackageOpen className="h-7 w-7" />
            </div>
            <h3 className="font-serif-display text-[22px] text-[var(--ink)]">
              Nothing in this category yet
            </h3>
            <p className="max-w-[36ch] text-[13.5px]">
              Try another category, or browse the full collection.
            </p>
            <button
              type="button"
              onClick={() => onCategoryChange('all')}
              className="mt-2 min-h-[38px] rounded-xl border border-[var(--line-2)] px-4 text-[13px] font-medium text-[var(--ink)] hover:border-[var(--clay)]"
            >
              Show all products
            </button>
          </div>
        )}
      </div>

      <p className="mt-8 border-t border-[var(--line)] pt-4 text-[12px] text-[var(--muted)]">
        Showing {filtered.length} of {products.length} products. Prices include GST.
      </p>
    </section>
  );
};
