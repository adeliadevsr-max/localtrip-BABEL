/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface BrandLogoProps {
  scrolled?: boolean;
  lightBackground?: boolean;
  premiumTheme?: boolean;
}

export default function BrandLogo({ scrolled = false, lightBackground = false, premiumTheme = false }: BrandLogoProps) {
  // Check if dark theme active or scrolled to choose text color
  const isDarkText = scrolled || lightBackground;

  const textColor = premiumTheme
    ? 'text-[#F1ECE4]' // Premium theme is always elegant dark background luxury
    : isDarkText 
      ? 'text-[#1E2533] dark:text-[#FCFAF7]' 
      : 'text-white';

  const goldAccentColor = 'text-[#C5A880] dark:text-[#D4AF37]';

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Minimalist geometric double-ring premium resort emblem */}
      <div className="relative flex items-center justify-center shrink-0">
        <div className="w-8.5 h-8.5 rounded-full border border-stone-200/45 dark:border-stone-800/60 flex items-center justify-center relative bg-transparent">
          {/* Inner ring in premium gold */}
          <div className="w-5.5 h-5.5 rounded-full border border-[#C5A880] dark:border-[#D4AF37] flex items-center justify-center relative">
            {/* Soft geometric wave representing sea, island, and luxury hospitality */}
            <div className="w-1.5 h-1.5 rounded-full bg-[#C5A880] dark:bg-[#D4AF37]" />
          </div>
          {/* Crescent arch separator representing horizon */}
          <div className="absolute bottom-1 w-5 h-[1.5px] bg-[#C5A880] dark:bg-[#D4AF37] opacity-65" />
        </div>
      </div>

      <div className="flex flex-col text-left">
        {/* Typographically pristine display */}
        <h1 className={`font-serif font-light text-base tracking-[0.2em] uppercase leading-none flex items-center ${textColor}`}>
          B A B E L
          <span className="text-[#C5A880] dark:text-[#D4AF37] font-sans font-extrabold mx-0.5 lowercase">.</span>
          <span className="text-[#C5A880] dark:text-[#D4AF37] font-semibold text-xs tracking-widest lowercase">trip</span>
        </h1>
        <span className="text-[7px] tracking-[0.26em] font-mono font-medium block uppercase mt-1 text-[#C5A880] dark:text-[#D4AF37]/90">
          MARITIME ARCHIPELAGO
        </span>
      </div>
    </div>
  );
}
