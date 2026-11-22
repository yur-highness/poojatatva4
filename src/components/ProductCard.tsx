import React from 'react';
import { Plus } from 'lucide-react';
import {type Product } from '../types';
import { formatMoney } from '../data/storeData';
import { ArtSvg } from './ArtSvg';
import { SacredFrameCard } from './SacredFrameCard';

interface ProductCardProps {
  product: Product;
  onAdd: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  return (
    <article className="gsap-reveal group min-w-0">
      <SacredFrameCard
        className="aspect-[1/1.2]"
        innerClassName={`tone-${product.tone}`}
      >
        {product.image ? (
          <>
            <div
              data-parallax-art
              className="absolute -inset-y-[8%] inset-x-0 overflow-hidden will-change-transform"
            >
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="h-full w-full scale-[1.04] object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.1]"
              />
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#051B1F]/45 via-transparent via-45% to-[#051B1F]/82"
            />
          </>
        ) : (
          <div
            data-parallax-art
            className="flex h-full w-full items-center justify-center pb-3 will-change-transform"
          >
            <ArtSvg
              name={product.art}
              className="w-[46%] text-[#FDF2DA] transition-transform duration-500 ease-out group-hover:scale-[1.06]"
            />
          </div>
        )}
        <button
          type="button"
          onClick={() => onAdd(product.id)}
          aria-label={`Add ${product.name} to bag`}
          className="absolute bottom-3.5 left-1/2 z-30 inline-flex h-7 -translate-x-1/2 items-center gap-1 rounded-lg border border-[#FDF2DA]/35 bg-[#083339]/92 px-2.5 text-[11px] font-medium text-[#FDF2DA] backdrop-blur-md transition-all duration-200 hover:border-[#FDF2DA] hover:bg-[#B82E1E] hover:text-[#FDF2DA] sm:bottom-5 sm:h-8 sm:gap-1.5 sm:px-3.5 sm:text-[12px] sm:translate-y-1.5 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:focus-visible:translate-y-0 sm:focus-visible:opacity-100"
        >
          <span>Add</span>
          <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </button>
      </SacredFrameCard>

      <div className="mt-2.5 flex items-start justify-between gap-2 sm:mt-3 sm:gap-3">
        <div className="min-w-0">
          <span className="block truncate text-[9.5px] font-medium uppercase tracking-[0.11em] text-[var(--muted)] sm:text-[10.5px] sm:tracking-[0.12em]">
            {product.category}
          </span>
          <h3 className="font-serif-display mt-0.5 text-[17.5px] font-normal leading-snug text-[var(--ink)] sm:text-[21px]">
            {product.name}
          </h3>
        </div>
        <div className="shrink-0 pt-0.5 text-right tabular-nums">
          <span className="block text-[12.5px] font-semibold text-[var(--ink)] sm:text-[13.5px]">
            {formatMoney(product.price)}
          </span>
          <s className="block text-[10.5px] text-[var(--muted)] sm:text-[11.5px]">
            {formatMoney(product.old)}
          </s>
        </div>
      </div>
    </article>
  );
};
