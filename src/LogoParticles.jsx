import React from "react";

/** Compact TalentPath monogram mark, matched to the cinematic intro identity. */
export default function LogoParticles() {
  return (
    <svg className="brand-particle-canvas talentpath-brand-symbol" viewBox="0 0 48 48" role="img" aria-label="TalentPath TP logo">
      <defs>
        <linearGradient id="tp-brand-gradient" x1="5" y1="3" x2="43" y2="45" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f7f8ff" />
          <stop offset=".42" stopColor="#b79aff" />
          <stop offset=".72" stopColor="#8b5cff" />
          <stop offset="1" stopColor="#27e5ff" />
        </linearGradient>
        <linearGradient id="tp-brand-orbit" x1="4" y1="24" x2="45" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#b35dff" />
          <stop offset="1" stopColor="#27e5ff" />
        </linearGradient>
        <filter id="tp-brand-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>
      <ellipse cx="24" cy="24" rx="21" ry="10.5" fill="none" stroke="url(#tp-brand-orbit)" strokeWidth="1.6" transform="rotate(-31 24 24)" opacity=".9"/>
      <path d="M10 12h26l-4.5 7H24l-5.5 18h-8l5.5-18H6z" fill="url(#tp-brand-gradient)"/>
      <path d="M23 20h11.5c7 0 9.5 3.4 7.7 8.4-1.7 4.9-5.5 7.6-12 7.6H20l2.2-7h9.1c1.7 0 2.6-.6 3-1.8.4-1.2-.2-1.8-1.8-1.8h-8z" fill="url(#tp-brand-gradient)"/>
      <circle cx="39.5" cy="8.5" r="1.7" fill="#d9d2ff"/>
    </svg>
  );
}
