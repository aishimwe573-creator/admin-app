import React from 'react';

interface PiLogoProps {
  size?: number;
}

export default function PiLogo({ size = 44 }: PiLogoProps) {
  return (
    <div
      className="flex items-center justify-center rounded-xl animate-pulse-gold"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #1B2B5E 0%, #2A4DB5 100%)',
        border: '1.5px solid rgba(240,165,0,0.4)',
        flexShrink: 0,
      }}
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
        <text
          x="50%"
          y="55%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="#F0A500"
          fontSize="16"
          fontFamily="Fraunces, serif"
          fontWeight="700"
        >
          π
        </text>
      </svg>
    </div>
  );
}