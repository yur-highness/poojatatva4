import React from 'react';
import {type ArtName } from '../types';

interface ArtSvgProps {
  name: ArtName;
  className?: string;
}

export const ArtSvg: React.FC<ArtSvgProps> = ({ name, className = '' }) => {
  const baseProps = {
    viewBox: '0 0 100 100',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.45,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
    className: `overflow-visible ${className}`,
  };

  switch (name) {
    case 'diya':
      return (
        <svg {...baseProps}>
          <path d="M18 57h64c0 13-14 22-32 22S18 70 18 57z" />
          <path d="M38 79h24l3 8H35z" />
          <path d="M42 61c5 2 11 2 16 0" opacity=".4" />
          <path
            d="M50 24c7 9 10.5 15.5 10.5 20.5a10.5 10.5 0 0 1-21 0c0-5 3.5-11.5 10.5-20.5z"
            fill="var(--clay)"
            stroke="none"
            opacity=".95"
          />
          <path
            d="M50 34.5c2.8 3.8 4.2 6.6 4.2 8.7a4.2 4.2 0 0 1-8.4 0c0-2.1 1.4-4.9 4.2-8.7z"
            fill="#FFF6E2"
            stroke="none"
          />
        </svg>
      );

    case 'thali':
      return (
        <svg {...baseProps}>
          <ellipse cx="50" cy="53" rx="35" ry="30" />
          <ellipse cx="50" cy="53" rx="27" ry="22.5" opacity=".32" />
          <circle cx="36" cy="41" r="6" />
          <circle cx="63" cy="39" r="5.5" />
          <circle cx="65" cy="62" r="6" />
          <path d="M30 66c5 4 12 6 20 6" opacity=".3" />
          <path
            d="M44 55c3.4 4.6 5.1 7.8 5.1 10.2a5.1 5.1 0 0 1-10.2 0c0-2.4 1.7-5.6 5.1-10.2z"
            fill="var(--clay)"
            stroke="none"
          />
          <path d="M44 65h10c0 3.4-2.2 5.6-5 5.6s-5-2.2-5-5.6z" />
        </svg>
      );

    case 'mala':
      return (
        <svg {...baseProps}>
          <circle cx="50" cy="45" r="26" opacity=".3" />
          <circle cx="76" cy="45" r="3" />
          <circle cx="72.5" cy="58" r="3" />
          <circle cx="63" cy="67.5" r="3" />
          <circle cx="50" cy="71" r="3" />
          <circle cx="37" cy="67.5" r="3" />
          <circle cx="27.5" cy="58" r="3" />
          <circle cx="24" cy="45" r="3" />
          <circle cx="27.5" cy="32" r="3" />
          <circle cx="37" cy="22.5" r="3" />
          <circle cx="50" cy="19" r="3" />
          <circle cx="63" cy="22.5" r="3" />
          <circle cx="72.5" cy="32" r="3" />
          <path d="M50 74v6" />
          <path d="M44.5 88l5.5-7 5.5 7z" fill="var(--clay)" stroke="none" />
        </svg>
      );

    case 'incense':
      return (
        <svg {...baseProps}>
          <path d="M34 76h32l-3 8H37z" />
          <path d="M50 76V45" />
          <path d="M50 45c-7-6 7-10 0-16s7-10 0-16" opacity=".85" />
          <path d="M62 53c-4-5 4-8 0-13" opacity=".45" />
          <circle cx="50" cy="45" r="2.2" fill="var(--clay)" stroke="none" />
        </svg>
      );

    case 'kalash':
      return (
        <svg {...baseProps}>
          <path d="M28 55c0-9 10-15 22-15s22 6 22 15c0 16-10 26-22 26s-22-10-22-26z" />
          <path d="M40 40h20l-2 6H42z" />
          <path d="M35 34c0-2 7-3 15-3s15 1 15 3" />
          <path d="M43 31c-9-1-14-7-12-13 5 2 10 7 12 13z" />
          <path d="M57 31c9-1 14-7 12-13-5 2-10 7-12 13z" />
          <circle cx="50" cy="20" r="5.5" />
          <path d="M33 64c5 3 29 3 34 0" opacity=".3" />
        </svg>
      );

    case 'gift':
      return (
        <svg {...baseProps}>
          <path d="M27 44h46v34a4 4 0 0 1-4 4H31a4 4 0 0 1-4-4z" />
          <path d="M22 36h56v9H22z" />
          <path d="M50 36v46" />
          <path d="M50 36c-4-7-12-11-15-6-3 5 7 8 15 6z" />
          <path d="M50 36c4-7 12-11 15-6 3 5-7 8-15 6z" />
        </svg>
      );

    case 'bell':
      return (
        <svg {...baseProps}>
          <path d="M50 16v7" />
          <path d="M50 26c-12 0-19 10-19 23 0 7-2 11-6 15h50c-4-4-6-8-6-15 0-13-7-23-19-23z" />
          <path d="M42 64c0 6 4 10 8 10s8-4 8-10" />
          <path d="M50 32v5" opacity=".35" />
          <circle cx="50" cy="78" r="3" fill="var(--clay)" stroke="none" />
        </svg>
      );

    case 'lotus':
      return (
        <svg {...baseProps}>
          <path d="M50 28c8 8 12 16 12 22a12 12 0 0 1-24 0c0-6 4-14 12-22z" />
          <path d="M50 50c-4-10-14-16-22-14 0 10 8 18 22 18" />
          <path d="M50 50c4-10 14-16 22-14 0 10-8 18-22 18" />
          <path d="M22 61c6 10 16 14 28 14s22-4 28-14" />
        </svg>
      );

    case 'namaste':
      return (
        <svg {...baseProps}>
          <path d="M50 22c-6 7-10 15-10 25v17c0 6 4 10 10 10z" />
          <path d="M50 22c6 7 10 15 10 25v17c0 6-4 10-10 10z" />
          <path d="M50 27v40" opacity=".35" />
          <path d="M40 72c-4 4-7 6-11 8M60 72c4 4 7 6 11 8" />
          <path d="M27 82h46" opacity=".28" />
        </svg>
      );

    case 'prasad':
      return (
        <svg {...baseProps}>
          <path d="M28 54h44c0 12-10 20-22 20s-22-8-22-20z" />
          <path d="M24 54h52" />
          <circle cx="40" cy="40" r="3.4" />
          <circle cx="50" cy="35" r="3.4" />
          <circle cx="60" cy="40" r="3.4" />
          <path d="M30 64c6 3 34 3 40 0" opacity=".35" />
        </svg>
      );

    case 'jal':
      return (
        <svg {...baseProps}>
          <path d="M50 22s17 19 17 30a17 17 0 0 1-34 0c0-11 17-30 17-30z" />
          <path d="M50 44v18" opacity=".4" />
          <path d="M41 62c2 4 5 6 9 6" opacity=".5" />
        </svg>
      );

    case 'vessel':
      return (
        <svg {...baseProps}>
          <path d="M20 44h60c0 17-13 29-30 29S20 61 20 44z" />
          <path d="M16 44h68" />
          <path d="M38 73h24l3 7H35z" opacity=".45" />
          <path d="M28 54c6 4 38 4 44 0" opacity=".25" />
        </svg>
      );

    case 'video':
    default:
      return (
        <svg {...baseProps}>
          <circle cx="50" cy="50" r="31" />
          <path d="M43 38l20 12-20 12z" fill="var(--clay)" stroke="none" />
          <path d="M26 72c7-5 41-5 48 0" opacity=".35" />
        </svg>
      );
  }
};
