import { useEffect, useRef, useState } from 'react';
import athenaLogo from "../assets/athena_voice_ass_logo.png";

/**
 * Fluid "liquid sphere" glob for the voice overlay.
 *
 * Adapted from the standalone floating-glob artifact: the sphere's
 * outer boundary continuously morphs like liquid (Catmull-Rom ->
 * cubic beziers around N control points), while the Seven Skys logo
 * sits crisp and steady in the center and slowly spins with the
 * whole glob.
 *
 * Wobble amplitude eases up while `active` is true (listening /
 * speaking) and eases back down to a calm resting wobble the rest
 * of the time — no mouse interaction needed, driven purely by the
 * assistant's current phase.
 */
const DOTS = [
  { angle: 200, dist: 118, r: 5, color: '#5eead4', delay: 0 },
  { angle: 250, dist: 132, r: 4, color: '#fbbf24', delay: 0.6 },
  { angle: 300, dist: 100, r: 3, color: '#8b5cf6', delay: 1.1 },
  { angle: 20, dist: 128, r: 4, color: '#fb923c', delay: 1.6 },
  { angle: 60, dist: 108, r: 3.5, color: '#94a3b8', delay: 0.3 },
  { angle: 340, dist: 96, r: 3, color: '#e2e8f0', delay: 1.9 },
];

function useAnimationFrame(callback) {
  const cbRef = useRef(callback);
  cbRef.current = callback;
  useEffect(() => {
    let raf;
    const loop = (t) => {
      cbRef.current(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
}

// Smooth closed "liquid" boundary from N control points around a circle,
// interpolated with Catmull-Rom -> cubic beziers.
function buildFluidPath(cx, cy, baseR, offsets) {
  const n = offsets.length;
  const pts = offsets.map((off, i) => {
    const a = (i / n) * Math.PI * 2;
    const r = baseR + off;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });

  const d = [];
  for (let i = 0; i < n; i += 1) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];

    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;

    if (i === 0) d.push(`M ${p1[0].toFixed(2)} ${p1[1].toFixed(2)}`);
    d.push(
      `C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`
    );
  }
  d.push('Z');
  return d.join(' ');
}

export default function FluidGlob({ logo, size = 200, active = false }) {
  const [path, setPath] = useState('');
  const ampRef = useRef(2);
  const targetAmpRef = useRef(2);
  targetAmpRef.current = active ? 7 : 2;

  const CX = 200;
  const CY = 200;
  const BASE_R = 92;
  const N = 10;

  useAnimationFrame((t) => {
    const time = t * 0.001;
    // ease amplitude toward its target: small idle wobble vs. a bit
    // more movement while actively listening / speaking
    ampRef.current += (targetAmpRef.current - ampRef.current) * 0.05;
    const amp = ampRef.current;
    const speedMul = active ? 1.5 : 1;

    const offsets = Array.from({ length: N }, (_, i) => {
      const phase = time * 0.35 * speedMul + i * 1.8;
      const phase2 = time * 0.25 * speedMul + i * 2.4;
      return (Math.sin(phase) * 0.6 + Math.cos(phase2) * 0.4) * amp;
    });

    setPath(buildFluidPath(CX, CY, BASE_R, offsets));
  });

  return (
    <div className="fluid-glob-float" style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 400 400" style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id="fg-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#bff3ea" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#d9f2f7" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#eef6fb" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="fg-sphere" cx="42%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#eaf7fb" />
            <stop offset="100%" stopColor="#d7ecf5" />
          </radialGradient>
          <filter id="fg-edge-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        <circle
          cx="200"
          cy="200"
          r="150"
          fill="none"
          stroke="rgba(148,163,184,0.35)"
          strokeWidth="1"
          strokeDasharray="2 6"
          opacity="0.6"
        />
        <circle cx="200" cy="200" r="150" fill="url(#fg-halo)" />

        {/* the fluid sphere itself — one boundary, gently liquid */}
        <path d={path} fill="url(#fg-sphere)" />
        <path d={path} fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.55" filter="url(#fg-edge-glow)" />

        {DOTS.map((d, i) => {
          const rad = (d.angle * Math.PI) / 180;
          const x = 200 + Math.cos(rad) * d.dist;
          const y = 200 + Math.sin(rad) * d.dist;
          return (
            <circle
              key={i}
              className="fluid-glob-dot"
              cx={x}
              cy={y}
              r={d.r}
              fill={d.color}
              style={{ animationDelay: `${d.delay}s` }}
            />
          );
        })}
      </svg>

      {/* logo sits crisp & steady on top, spinning slowly with the glob */}
      <div className="fluid-glob-logo-layer">
        <img src={athenaLogo} alt="" className="fluid-glob-logo" />
      </div>
    </div>
  );
}
