import React from 'react';

interface BrandLogoProps {
  variant?: 'emblem' | 'horizontal' | 'minimal' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  inverted?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  inverted = false,
}) => {
  const sizeMap = {
    sm: { w: 32, h: 32, text: 'text-lg', subtext: 'text-[9px]' },
    md: { w: 46, h: 46, text: 'text-2xl', subtext: 'text-[11px]' },
    lg: { w: 84, h: 84, text: 'text-3xl', subtext: 'text-xs' },
    xl: { w: 140, h: 140, text: 'text-4xl', subtext: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  // Primary circular seal / botanical emblem SVG
  const EmblemSVG = (
    <svg
      viewBox="0 0 200 200"
      width={currentSize.w}
      height={currentSize.h}
      className="transition-transform duration-300 hover:rotate-3"
      aria-label="Mist and Coffee Brand Emblem"
    >
      <defs>
        <path
          id="circlePathTop"
          d="M 28 100 A 72 72 0 0 1 172 100"
          fill="none"
        />
        <path
          id="circlePathBottom"
          d="M 172 100 A 72 72 0 0 1 28 100"
          fill="none"
        />
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <radialGradient id="mistEmblemBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFF8F0" />
          <stop offset="70%" stop-color="#F4D6C6" />
          <stop offset="100%" stop-color="#EBCBCB" />
        </radialGradient>
      </defs>

      {/* Outer scalloped / decorative ring */}
      <circle
        cx="100"
        cy="100"
        r="94"
        fill="url(#mistEmblemBg)"
        stroke="#795548"
        strokeWidth="1.5"
        strokeDasharray="4 2"
      />
      <circle
        cx="100"
        cy="100"
        r="86"
        fill="none"
        stroke="#35251F"
        strokeWidth="2"
      />
      <circle
        cx="100"
        cy="100"
        r="60"
        fill="#FFF8F0"
        stroke="#C8D5C0"
        strokeWidth="1.5"
      />

      {/* Arched typography */}
      <text
        fill="#35251F"
        fontSize="11.5"
        fontFamily="'Cormorant Garamond', 'Playfair Display', serif"
        fontWeight="700"
        letterSpacing="3.5"
      >
        <textPath href="#circlePathTop" startOffset="50%" textAnchor="middle">
          MIST AND COFFEE
        </textPath>
      </text>

      <text
        fill="#795548"
        fontSize="8"
        fontFamily="'Plus Jakarta Sans', sans-serif"
        fontWeight="600"
        letterSpacing="2.5"
      >
        <textPath href="#circlePathBottom" startOffset="50%" textAnchor="middle">
          ESTD • SPECIALITY CAFE • 2024
        </textPath>
      </text>

      {/* Botanical sprigs on left and right */}
      <g stroke="#C8D5C0" strokeWidth="1.2" fill="#C8D5C0">
        {/* Left branch */}
        <path d="M 46 96 Q 52 90 56 82" fill="none" stroke="#6E8563" />
        <ellipse cx="50" cy="88" rx="4" ry="2" transform="rotate(-30 50 88)" fill="#8FA583" />
        <ellipse cx="56" cy="80" rx="3.5" ry="1.8" transform="rotate(-15 56 80)" fill="#C8D5C0" />
        <circle cx="53" cy="94" r="2" fill="#EBCBCB" />

        {/* Right branch */}
        <path d="M 154 96 Q 148 90 144 82" fill="none" stroke="#6E8563" />
        <ellipse cx="150" cy="88" rx="4" ry="2" transform="rotate(30 150 88)" fill="#8FA583" />
        <ellipse cx="144" cy="80" rx="3.5" ry="1.8" transform="rotate(15 144 80)" fill="#C8D5C0" />
        <circle cx="147" cy="94" r="2" fill="#EBCBCB" />
      </g>

      {/* Rising Mist / Steam trails */}
      <g stroke="#B89B92" strokeWidth="1.8" strokeLinecap="round" fill="none">
        <path d="M 94 82 C 90 72 104 66 98 56 C 94 50 99 44 96 40" stroke="#795548" opacity="0.8" />
        <path d="M 104 80 C 110 70 96 64 103 54 C 107 48 102 42 105 38" stroke="#C8D5C0" opacity="0.9" strokeWidth="1.5" />
        <path d="M 100 84 C 98 75 106 72 102 62" stroke="#DFB4B4" opacity="0.8" />
      </g>

      {/* Artisanal Ceramic Coffee Cup */}
      <g>
        {/* Saucer */}
        <ellipse cx="100" cy="122" rx="28" ry="4" fill="#35251F" opacity="0.2" />
        <path d="M 76 120 C 82 125 118 125 124 120 C 118 122 82 122 76 120 Z" fill="#795548" />

        {/* Cup Body */}
        <path
          d="M 80 94 L 120 94 C 118 112 112 118 100 118 C 88 118 82 112 80 94 Z"
          fill="#35251F"
        />

        {/* Cup Handle */}
        <path
          d="M 119 98 C 127 98 127 109 117 111"
          fill="none"
          stroke="#35251F"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Coffee Surface Cream Swirl */}
        <ellipse cx="100" cy="94" rx="20" ry="3.5" fill="#795548" />
        <ellipse cx="100" cy="93.5" rx="16" ry="2.2" fill="#FFF8F0" opacity="0.4" />
        
        {/* Little Latte Art Heart */}
        <path
          d="M 100 106 C 98 103 94 103 94 105.5 C 94 108 100 111 100 111 C 100 111 106 108 106 105.5 C 106 103 102 103 100 106 Z"
          fill="#F4D6C6"
          opacity="0.9"
        />
      </g>
    </svg>
  );

  if (variant === 'emblem') {
    return (
      <div className={`inline-flex flex-col items-center justify-center ${className}`}>
        {EmblemSVG}
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <div className="w-10 h-10 rounded-full bg-pastelPeach-200 border border-dustyPink-400 flex items-center justify-center p-1 shadow-soft-sm">
          {EmblemSVG}
        </div>
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-3 p-2 px-3 rounded-full bg-cream-50/80 backdrop-blur-sm border border-pastelPeach-200/80 shadow-soft-sm ${className}`}>
        <div className="w-8 h-8 flex-shrink-0">
          {EmblemSVG}
        </div>
        <div>
          <p className="font-serif font-bold text-sm tracking-wide text-espresso-600 leading-tight">
            Mist and Coffee
          </p>
          <p className="text-[10px] text-cocoaBrown-400 font-sans tracking-wider uppercase">
            Speciality Cafe
          </p>
        </div>
      </div>
    );
  }

  // Default 'horizontal' navbar / header brand layout
  return (
    <div className={`inline-flex items-center gap-3 cursor-pointer group select-none ${className}`}>
      <div className="relative flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
        {EmblemSVG}
        {/* Subtle steam particle animation indicator */}
        <span className="absolute -top-1 right-1 w-2 h-2 rounded-full bg-sageGreen-400 animate-ping opacity-75" />
      </div>

      <div className="flex flex-col">
        <span
          className={`font-serif font-bold tracking-tight leading-none ${
            inverted ? 'text-cream-50' : 'text-espresso-600'
          } ${currentSize.text}`}
        >
          Mist &amp; Coffee
        </span>
        <span
          className={`font-sans tracking-[0.2em] uppercase font-medium mt-0.5 ${
            inverted ? 'text-dustyPink-300' : 'text-cocoaBrown-400'
          } ${currentSize.subtext}`}
        >
          Speciality Roastery &amp; Slow Bar
        </span>
      </div>
    </div>
  );
};
