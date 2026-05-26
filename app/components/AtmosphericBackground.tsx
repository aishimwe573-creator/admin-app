'use client';

import React, { useEffect, useRef } from 'react';

export default function AtmosphericBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const orbs = containerRef.current?.querySelectorAll<HTMLElement>('[data-parallax]');
      if (!orbs) return;
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      orbs.forEach((orb) => {
        const speed = parseFloat(orb.dataset.parallax || '1');
        orb.style.transform = `translate(${(x - 0.5) * speed * 30}px, ${(y - 0.5) * speed * 20}px)`;
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large gold orb */}
      <div
        data-parallax="1.2"
        className="orb orb-gold animate-orb-float"
        style={{ width: 600, height: 600, top: '-10%', left: '5%', opacity: 0.7 }}
      />
      {/* Blue orb */}
      <div
        data-parallax="0.8"
        className="orb orb-blue animate-orb-float delay-300"
        style={{ width: 500, height: 500, bottom: '-5%', right: '-5%', opacity: 0.8 }}
      />
      {/* Small indigo orb */}
      <div
        data-parallax="1.5"
        className="orb orb-indigo animate-orb-float delay-500"
        style={{ width: 300, height: 300, top: '40%', left: '40%', opacity: 0.5 }}
      />
      {/* Tiny gold accent */}
      <div
        data-parallax="2"
        className="orb orb-gold"
        style={{ width: 200, height: 200, top: '20%', right: '30%', opacity: 0.3 }}
      />
      {/* Grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
}