import React from 'react';

interface EscaliaLogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
  showSubtitle?: boolean;
}

export const EscaliaLogo: React.FC<EscaliaLogoProps> = ({
  className = '',
  variant = 'dark',
  showSubtitle = true,
}) => {
  // Color palette matching official brand image
  const textColor = variant === 'light' ? '#0c1d37' : '#ffffff';
  const subtitleColor = '#2870ed'; // Brand light blue
  const triangleColor = '#2870ed';
  const triangleFacet = '#60a5fa';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Symbol Mark: Geometric E + Blue Ascending Triangle */}
      <div className="relative flex items-center shrink-0">
        <svg
          width="44"
          height="34"
          viewBox="0 0 100 76"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 md:h-9 w-auto"
        >
          {/* Main Solid 'E' */}
          <path
            d="M0 0H54V17H19V29H50V45H19V58H54V76H0V0Z"
            fill={textColor}
          />
          {/* Main Ascending Blue Triangle */}
          <polygon
            points="58,76 100,76 79,38"
            fill={triangleColor}
          />
          {/* Top-Right Light Accent Facet */}
          <polygon
            points="79,38 72,50 90,50"
            fill={triangleFacet}
            opacity="0.85"
          />
        </svg>
      </div>

      {/* Brand Name & Subtitle */}
      <div className="flex flex-col justify-center leading-none">
        <span
          className="font-display font-black text-xl md:text-2xl tracking-tight"
          style={{ color: textColor, letterSpacing: '0.04em' }}
        >
          ESCALIA
        </span>
        {showSubtitle && (
          <span
            className="hidden sm:inline-block font-mono-custom text-[8px] md:text-[9px] uppercase font-bold tracking-widest mt-0.5"
            style={{ color: subtitleColor, letterSpacing: '0.12em' }}
          >
            SaaS Development &amp; Growth Studio
          </span>
        )}
      </div>
    </div>
  );
};
