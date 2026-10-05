import { useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import HandsTyping from './HandsTyping.jsx';

/** Tracks the OS "reduce motion" setting so JS effects can stand down with it. */
function useMotionOK() {
  const ok = useRef(true);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    ok.current = !mq.matches;
    const onChange = () => { ok.current = !mq.matches; };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return ok;
}

/**
 * Split authentication shell: a full-bleed photograph on the left carrying the
 * headline and call to action, and a clean white form panel on the right.
 *
 * The animated scene is wrapped in its own layer so the JS parallax transform
 * and the CSS keyframes can run simultaneously instead of overwriting each other.
 */
export default function AuthSplit({
  eyebrow, headline, blurb, ctaLabel, onCta, children,
}) {
  const layerRef = useRef(null);
  const motionOK = useMotionOK();

  const onMove = useCallback((e) => {
    if (!motionOK.current || !layerRef.current) return;
    const r = layerRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    layerRef.current.style.transform = `translate3d(${(px * 26).toFixed(1)}px, ${(py * 18).toFixed(1)}px, 0) scale(1.04)`;
  }, [motionOK]);

  const onLeave = useCallback(() => {
    if (layerRef.current) layerRef.current.style.transform = '';
  }, []);

  return (
    <div className="auth-split">
      {/* ------------------------------------------------ photo side */}
      <section className="split-visual" onMouseMove={onMove} onMouseLeave={onLeave}>
        <div className="split-layer" ref={layerRef} aria-hidden="true">
          <HandsTyping />
        </div>
        <div className="split-tint" aria-hidden="true" />
        <div className="split-grain" aria-hidden="true" />

        <div className="split-copy">
          <span className="split-eyebrow">{eyebrow}</span>
          <h1 className="split-headline">{headline}</h1>
          <p className="split-blurb">{blurb}</p>
          {ctaLabel && (
            <button type="button" className="split-cta" onClick={onCta}>{ctaLabel}</button>
          )}
        </div>

        <Link to="/" className="split-back"><ArrowLeft size={15} /> Back</Link>
      </section>

      {/* ------------------------------------------------ form side */}
      <section className="split-panel">
        <div className="split-panel-inner">{children}</div>
      </section>
    </div>
  );
}