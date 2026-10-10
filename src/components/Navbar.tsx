import { useState } from 'react';

interface NavbarProps {
  activeSection: string;
  onSelectSection: (section: string) => void;
}

const NAV_LINKS = ['Home', 'About', 'Work', 'Services', 'Contact'];

export default function Navbar({ activeSection, onSelectSection }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleMobileNavClick = (section: string) => {
    setIsMobileMenuOpen(false);
    onSelectSection(section);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-20 w-full px-5 sm:px-8 lg:px-12 py-4 sm:py-5 flex justify-between items-center pointer-events-auto">
        {/* Brand Logo (far left): MAINFRAME */}
        <div
          onClick={() => onSelectSection('Home')}
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <span
            className="text-xl sm:text-2xl font-bold tracking-wider text-white uppercase"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            MAINFRAME
          </span>
          <span
            className="text-lg sm:text-xl text-[#facc15] select-none leading-none -mt-0.5 transition-transform group-hover:rotate-45 duration-300"
            aria-hidden="true"
          >
            ✳
          </span>
        </div>

        {/* Centered navigation links (desktop) */}
        <nav
          className="hidden md:flex items-center gap-1 lg:gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10"
          style={{ fontFamily: 'var(--font-body)' }}
          aria-label="Main Navigation"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection.toLowerCase() === link.toLowerCase();
            return (
              <button
                key={link}
                onClick={() => onSelectSection(link)}
                className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-white bg-white/20 shadow-sm font-semibold'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {link}
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-[2px] bg-[#facc15] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Pill-shaped primary CTA (far right): Let's Talk → */}
        <div className="hidden md:flex items-center">
          <button
            onClick={() => onSelectSection("Let's Talk")}
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full text-sm font-semibold bg-[#facc15] hover:bg-[#fbbf24] text-black shadow-lg hover:shadow-[#facc15]/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <span>Let's Talk</span>
            <span className="text-base transition-transform group-hover:translate-x-0.5">→</span>
          </button>
        </div>

        {/* Mobile hamburger toggle (visible below md) */}
        <button
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          className="md:hidden relative z-30 flex flex-col justify-center items-center gap-[5px] p-2 focus:outline-none cursor-pointer"
        >
          <span
            className={`w-6 h-[2px] bg-white transition-all duration-300 transform origin-center ${
              isMobileMenuOpen ? 'translate-y-[7px] rotate-45 bg-black' : ''
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-white transition-all duration-300 ${
              isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-white transition-all duration-300 transform origin-center ${
              isMobileMenuOpen ? '-translate-y-[7px] -rotate-45 bg-black' : ''
            }`}
          />
        </button>
      </header>

      {/* Mobile overlay menu (z-index: 15) */}
      <div
        className={`fixed inset-0 z-15 bg-white/95 backdrop-blur-md md:hidden flex flex-col justify-center items-start px-8 sm:px-12 gap-6 transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="text-xs font-semibold tracking-[0.25em] text-black/50 uppercase mb-2">
          NAVIGATION
        </div>
        {NAV_LINKS.map((link) => {
          const isActive = activeSection.toLowerCase() === link.toLowerCase();
          return (
            <button
              key={link}
              onClick={() => handleMobileNavClick(link)}
              className={`text-3xl font-medium transition-opacity text-left cursor-pointer flex items-center gap-3 ${
                isActive ? 'text-black font-bold' : 'text-black/70 hover:text-black'
              }`}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {link}
              {isActive && <span className="w-2 h-2 rounded-full bg-[#facc15]" />}
            </button>
          );
        })}

        <div className="pt-6 w-full border-t border-black/10">
          <button
            onClick={() => handleMobileNavClick("Let's Talk")}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-base font-semibold bg-[#facc15] hover:bg-[#fbbf24] text-black shadow-md cursor-pointer"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <span>Let's Talk</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </>
  );
}
