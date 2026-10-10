import { useState } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';

interface HeroProps {
  onSelectAction: (action: string) => void;
}

export default function Hero({ onSelectAction }: HeroProps) {
  const { displayed, done } = useTypewriter(
    'Glad you stopped in. Good taste tends to find us. Now, what are we building?',
    38,
    600
  );

  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText('hello@mainframe.co');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="relative z-1 w-full h-screen flex flex-col justify-end pb-8 sm:pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:pl-12 lg:pl-16 xl:pl-20 overflow-hidden pointer-events-none">
      {/* Subtle Mobile Scrim at bottom to ensure 100% legibility */}
      <div
        className="md:hidden pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/60 via-black/30 to-transparent"
        aria-hidden="true"
      />

      {/* Floating hand-drawn callout on the right side pointing to the 3D character */}
      <div className="hidden lg:flex absolute top-[26%] right-[22%] xl:right-[26%] z-10 flex-col items-center pointer-events-none select-none">
        <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/25 text-white text-xs xl:text-sm font-medium tracking-wide shadow-xl transform -rotate-6">
          <span className="text-[#facc15]">✨</span>
          <span>Ideas into Impact</span>
        </div>
        {/* Curved hand-drawn arrow pointing toward the helmet character */}
        <svg
          className="w-16 h-12 text-[#facc15] transform rotate-12 -translate-x-3 mt-1 opacity-90 drop-shadow"
          viewBox="0 0 60 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 6 C 24 16, 34 26, 44 36"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="4 2"
          />
          <path
            d="M37 38 L 46 36 L 43 27"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Corner editorial coordinates badge */}
      <div className="hidden xl:flex absolute bottom-8 right-12 z-10 items-center gap-3 text-xs text-white/50 tracking-widest font-mono pointer-events-none select-none">
        <span>LOC // 35.6762° N, 139.6503° E</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#facc15]/80 animate-ping" />
      </div>

      {/* Hero content container strictly anchored to the left third */}
      <div className="max-w-xl lg:max-w-[540px] xl:max-w-[580px] w-full relative z-10 pointer-events-auto">
        {/* Category Tracker above headline: IDEAS / DESIGN / TECHNOLOGY in uppercase tracked-out small caps */}
        <div
          className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#facc15] uppercase mb-3 sm:mb-4 flex items-center gap-2"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <span className="w-2 h-2 rounded-full bg-[#facc15] shadow-[0_0_8px_#facc15]" />
          <span>IDEAS / DESIGN / TECHNOLOGY</span>
        </div>

        {/* Multi-line typographic treatment: "Creative Solutions for a" (crisp white) + "Brighter Future" (striking yellow with hand-drawn underline) */}
        <h1
          className="text-3xl sm:text-5xl lg:text-5xl xl:text-[58px] font-extrabold text-white leading-[1.08] tracking-[-0.03em] mb-4 sm:mb-5"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Creative Solutions <br className="hidden sm:inline" />for a{' '}
          <span className="relative inline-block text-[#facc15] whitespace-nowrap">
            Brighter Future
            {/* Hand-drawn underline accent */}
            <svg
              className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3 sm:h-4 text-[#facc15] pointer-events-none"
              viewBox="0 0 260 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path
                d="M3 13C60 3 160 2 257 8M10 16C80 7 190 5 248 13"
                stroke="currentColor"
                strokeWidth="3.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </h1>

        {/* Typewriter text / narrative subline */}
        <p
          className="text-white/85 text-sm sm:text-base lg:text-lg mb-5 sm:mb-6 leading-relaxed max-w-lg font-normal min-h-[48px] sm:min-h-[54px]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {displayed}
          {!done && (
            <span
              className="inline-block w-[2px] h-[1.1em] bg-[#facc15] align-middle ml-[2px] animate-blink"
              aria-hidden="true"
            />
          )}
        </p>

        {/* Primary Action Buttons: Solid yellow CTA + Transparent outline video trigger */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
          {/* Solid yellow CTA button: Explore Our Work → */}
          <button
            onClick={() => onSelectAction('Work')}
            className="inline-flex items-center gap-2 bg-[#facc15] hover:bg-[#fbbf24] text-black font-semibold rounded-full px-6 sm:px-7 py-3 text-sm sm:text-base shadow-lg hover:shadow-[#facc15]/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <span>Explore Our Work</span>
            <span className="text-lg">→</span>
          </button>

          {/* Transparent outline video trigger button: ▶ Watch Showreel */}
          <button
            onClick={() => onSelectAction('Watch Showreel')}
            className="inline-flex items-center gap-2 border border-white/40 hover:border-white text-white hover:bg-white/10 rounded-full px-5 sm:px-6 py-3 text-sm sm:text-base backdrop-blur-sm transition-all duration-200 cursor-pointer"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <span className="text-[#facc15] text-xs">▶</span>
            <span>Watch Showreel</span>
          </button>

          {/* Outline email copy pill */}
          <button
            onClick={handleCopy}
            title="Click to copy email address"
            className="relative inline-flex items-center justify-center text-white/90 bg-black/30 hover:bg-white hover:text-black border border-white/20 hover:border-white rounded-full text-xs sm:text-sm px-4 py-2.5 whitespace-nowrap gap-2 cursor-pointer transition-colors duration-200 backdrop-blur-sm"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <span>
              Reach us:{' '}
              <span className="underline underline-offset-1">hello@mainframe.co</span>
            </span>
            {copied ? (
              <span className="text-[11px] font-medium text-[#facc15] tracking-wide">✓ Copied</span>
            ) : (
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
                aria-hidden="true"
              >
                <rect x="3.5" y="1.5" width="7" height="7" stroke="currentColor" strokeWidth="1" fill="none" />
                <rect x="1.5" y="3.5" width="7" height="7" stroke="currentColor" strokeWidth="1" fill="none" />
              </svg>
            )}
          </button>
        </div>

        {/* Supporting metrics/stats neatly at bottom-left separated by vertical dividers */}
        <div className="pt-4 sm:pt-5 border-t border-white/15 flex items-center gap-5 sm:gap-8">
          <div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tabular-nums tracking-tight">
              50+
            </div>
            <div className="text-xs sm:text-sm text-white/70 font-medium">Projects</div>
          </div>
          <div className="w-px h-7 bg-white/20" />
          <div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tabular-nums tracking-tight">
              30+
            </div>
            <div className="text-xs sm:text-sm text-white/70 font-medium">Happy Clients</div>
          </div>
          <div className="w-px h-7 bg-white/20" />
          <div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#facc15] tabular-nums tracking-tight">
              5
            </div>
            <div className="text-xs sm:text-sm text-white/70 font-medium">Years of Creativity</div>
          </div>
        </div>
      </div>
    </section>
  );
}
