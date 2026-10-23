import React from 'react';

interface BunBrewLogoProps {
  className?: string;
  size?: number;
}

export const BunBrewLogo: React.FC<BunBrewLogoProps> = ({ className = 'h-8 w-auto', size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="BUN & BREW Logo"
    >
      {/* Outer concentric roastery ring */}
      <circle cx="50" cy="50" r="46" stroke="#3B241C" strokeWidth="4" fill="#FEF9F0" />
      <circle cx="50" cy="50" r="41" stroke="#79573F" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />
      
      {/* Coffee cup */}
      <path
        d="M28 42 C28 42 28 66 50 66 C72 66 72 42 72 42 Z"
        fill="#3B241C"
      />
      {/* Cup handle */}
      <path
        d="M71 46 C77 46 81 50 81 55 C81 60 76 63 71 63"
        stroke="#3B241C"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Cup saucer plate */}
      <path
        d="M24 71 C24 71 36 75 50 75 C64 75 76 71 76 71"
        stroke="#79573F"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Coffee aroma steam lines */}
      <path
        d="M42 35 C40 31 43 27 41 23"
        stroke="#C68B59"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M50 36 C48 30 52 26 50 20"
        stroke="#79573F"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M58 35 C56 31 59 27 57 23"
        stroke="#C68B59"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
