import React, { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: string;
}

export default function Modal({ isOpen, onClose, title, type }: ModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    service: 'Creative Direction & 3D',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-neutral-900 text-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/15 overflow-hidden transform transition-transform max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span
              className="text-lg font-bold tracking-wider text-white"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              MAINFRAME
            </span>
            <span className="text-sm text-[#facc15]">/</span>
            <span className="text-sm font-medium text-white/80">{title}</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content based on type */}
        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 bg-[#facc15] text-black rounded-full flex items-center justify-center mx-auto text-lg font-bold">
              ✓
            </div>
            <h3 className="text-xl font-bold">Transmission Received</h3>
            <p className="text-sm text-white/70 max-w-xs mx-auto">
              Our studio leads will review your inquiry and get back to you within 24 hours.
            </p>
          </div>
        ) : (
          <>
            {/* WATCH SHOWREEL MODAL */}
            {type === 'showreel' && (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden aspect-video bg-black border border-white/15 shadow-inner flex items-center justify-center group">
                  <video
                    src="https://res.cloudinary.com/aoi1ofnl/video/upload/v1790020174/kling_20260922_VIDEO__594_0.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white/90 border border-white/10">
                    Mainframe Reel 2026 // 4K 60FPS
                  </div>
                </div>
                <div className="text-xs text-white/70 leading-relaxed">
                  A rapid-cut journey through our spatial design systems, generative neural avatars, kinetic web architectures, and interactive client installations.
                </div>
                <div className="pt-2 flex justify-end gap-3">
                  <button
                    onClick={onClose}
                    className="px-5 py-2 text-sm bg-[#facc15] text-black font-semibold rounded-full hover:bg-[#fbbf24] transition-colors cursor-pointer"
                  >
                    Done Watching
                  </button>
                </div>
              </div>
            )}

            {/* WORK / PROJECTS MODAL */}
            {(type === 'work' || type === 'studio') && (
              <div className="space-y-4">
                <p className="text-sm text-white/70">
                  Featured commissions and exploratory artifacts across design, code, and generative 3D:
                </p>
                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#facc15]/40 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white text-sm">Aether Spatial Audio</span>
                      <span className="text-[11px] text-[#facc15] font-mono">01 // BRAND & WEBGL</span>
                    </div>
                    <p className="text-xs text-white/60">Real-time binaural spatial sound visualizer and interactive vinyl player.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#facc15]/40 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white text-sm">Kling Avatar Identity 3.0</span>
                      <span className="text-[11px] text-[#facc15] font-mono">02 // 3D & MOTION</span>
                    </div>
                    <p className="text-xs text-white/60">Streetwear collectible avatar with kinetic camera choreography.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#facc15]/40 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white text-sm">Lumina Autonomous</span>
                      <span className="text-[11px] text-[#facc15] font-mono">03 // DESIGN SYSTEM</span>
                    </div>
                    <p className="text-xs text-white/60">Next-gen automotive human-machine interface for level 4 self-driving fleet.</p>
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-5 py-2 text-sm bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* ABOUT MODAL */}
            {type === 'about' && (
              <div className="space-y-4 text-sm text-white/80 leading-relaxed">
                <p>
                  <strong className="text-white">Mainframe</strong> is an independent creative studio and technology laboratory. We partner with visionary founders and global culture brands to engineer digital products that shape tomorrow.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-[#facc15] font-bold text-lg">50+</div>
                    <div className="text-xs text-white/60">Shipped Projects</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-[#facc15] font-bold text-lg">5 Years</div>
                    <div className="text-xs text-white/60">Creative Rigor</div>
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-5 py-2 text-sm bg-[#facc15] text-black font-semibold rounded-full hover:bg-[#fbbf24] transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* SERVICES MODAL */}
            {type === 'services' && (
              <div className="space-y-3 text-sm">
                <p className="text-white/70 text-xs">Our core multidisciplinary capabilities:</p>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="font-semibold text-white text-sm mb-0.5">01. Digital Platforms & Spatial Design</div>
                    <div className="text-xs text-white/60">Bespoke web applications, high-performance WebGL, and responsive interfaces.</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="font-semibold text-white text-sm mb-0.5">02. 3D Avatars & Kinetic Brand Identity</div>
                    <div className="text-xs text-white/60">Stylized 3D collectible characters, motion choreography, and brand toolkits.</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="font-semibold text-white text-sm mb-0.5">03. Creative Technologist Prototyping</div>
                    <div className="text-xs text-white/60">Rapid concept validation from hypothesis to production-ready implementation.</div>
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-5 py-2 text-sm bg-[#facc15] text-black font-semibold rounded-full hover:bg-[#fbbf24] transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* CONTACT / LET'S TALK / PITCH MODAL */}
            {(type === 'contact' || type === 'talk' || type === 'pitch') && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-white/70">
                  Ready to craft a brighter future? Tell us about your project timeline and vision.
                </p>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">
                    Your Name
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Elena Rostova"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/20 text-white text-sm focus:outline-none focus:border-[#facc15]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="elena@company.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/20 text-white text-sm focus:outline-none focus:border-[#facc15]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">
                    Project Scope & Brief
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you want to build together..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/20 text-white text-sm focus:outline-none focus:border-[#facc15] resize-none"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm text-white/70 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-sm bg-[#facc15] text-black font-semibold rounded-full hover:bg-[#fbbf24] transition-colors cursor-pointer"
                  >
                    Send Transmission →
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
