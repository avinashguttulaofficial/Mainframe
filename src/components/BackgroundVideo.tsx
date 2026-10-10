import { useEffect, useRef, useState, useCallback } from 'react';
import { saveVideoBlob, getVideoBlob, clearVideoBlob } from '../utils/videoStorage';
import posterImage from '../assets/images/kling_character_poster_1791600977979.jpg';

const DEFAULT_VIDEO_SRC = 'https://res.cloudinary.com/aoi1ofnl/video/upload/v1790020174/kling_20260922_VIDEO__594_0.mp4';
const POSTER_SRC = posterImage;

interface BackgroundVideoProps {
  onVideoLoadedInfo?: (info: { isCustom: boolean; name?: string }) => void;
}

export default function BackgroundVideo({ onVideoLoadedInfo }: BackgroundVideoProps) {
  const [videoSrc, setVideoSrc] = useState<string>(DEFAULT_VIDEO_SRC);
  const [isCustomVideo, setIsCustomVideo] = useState<boolean>(false);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [uploadToast, setUploadToast] = useState<string | null>(null);

  // Video adjustment state (persisted in localStorage)
  const [horizontalPosition, setHorizontalPosition] = useState<number>(35);
  const [verticalPosition, setVerticalPosition] = useState<number>(() => {
    const saved = localStorage.getItem('bg_video_pos_y');
    return saved ? Number(saved) : 50;
  });
  const [videoZoom, setVideoZoom] = useState<number>(() => {
    const saved = localStorage.getItem('bg_video_zoom');
    return saved ? Number(saved) : 100;
  });
  const [motionMode, setMotionMode] = useState<'scrub' | 'ambient' | 'loop'>(() => {
    const saved = localStorage.getItem('bg_video_motion');
    return (saved as 'scrub' | 'ambient' | 'loop') || 'ambient';
  });
  const [showAdjustPanel, setShowAdjustPanel] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const prevXRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeBlobUrlRef = useRef<string | null>(null);

  // Apply requested framing x: 35%
  useEffect(() => {
    localStorage.setItem('bg_video_pos_x', '35');
  }, []);

  // Save settings when changed
  useEffect(() => {
    localStorage.setItem('bg_video_pos_x', String(horizontalPosition));
    localStorage.setItem('bg_video_pos_y', String(verticalPosition));
    localStorage.setItem('bg_video_zoom', String(videoZoom));
    localStorage.setItem('bg_video_motion', motionMode);
  }, [horizontalPosition, verticalPosition, videoZoom, motionMode]);

  // Load persisted video from IndexedDB if available
  useEffect(() => {
    let isMounted = true;
    getVideoBlob().then((blob) => {
      if (!isMounted || !blob) return;
      try {
        const objectUrl = URL.createObjectURL(blob);
        activeBlobUrlRef.current = objectUrl;
        setVideoSrc(objectUrl);
        setIsCustomVideo(true);
        onVideoLoadedInfo?.({ isCustom: true, name: 'Uploaded Kling Video' });
      } catch (err) {
        console.error('Failed to create object URL for stored video', err);
      }
    });

    return () => {
      isMounted = false;
      if (activeBlobUrlRef.current) {
        URL.revokeObjectURL(activeBlobUrlRef.current);
      }
    };
  }, [onVideoLoadedInfo]);

  // Handle setting a new video file
  const handleApplyFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('video/')) {
      setUploadToast('Please drop a valid video file (.mp4, .webm, etc.)');
      setTimeout(() => setUploadToast(null), 3000);
      return;
    }

    try {
      await saveVideoBlob(file);
      if (activeBlobUrlRef.current) {
        URL.revokeObjectURL(activeBlobUrlRef.current);
      }
      const objectUrl = URL.createObjectURL(file);
      activeBlobUrlRef.current = objectUrl;
      setVideoSrc(objectUrl);
      setIsCustomVideo(true);
      setUploadToast('Kling video loaded & saved as background');
      setTimeout(() => setUploadToast(null), 3500);
      onVideoLoadedInfo?.({ isCustom: true, name: file.name });
    } catch (err) {
      console.error('Error saving video blob', err);
      setUploadToast('Could not save video');
      setTimeout(() => setUploadToast(null), 3000);
    }
  }, [onVideoLoadedInfo]);

  // Global drag-and-drop listeners
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer && Array.from(e.dataTransfer.types).includes('Files')) {
        setIsDraggingOver(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.clientX <= 0 || e.clientY <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
        setIsDraggingOver(false);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(false);

      if (e.dataTransfer && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        handleApplyFile(file);
      }
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, [handleApplyFile]);

  // Ambient playback handling
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (motionMode === 'loop' || motionMode === 'ambient') {
      video.playbackRate = 0.85;
      video.play().catch(() => {
        // Autoplay policy fallback
      });
    } else {
      video.pause();
    }
  }, [motionMode, videoSrc]);

  // Mouse scrub interaction
  useEffect(() => {
    const SENSITIVITY = 0.8;

    const handleMouseMove = (e: MouseEvent) => {
      const video = videoRef.current;
      if (!video || !video.duration || !isFinite(video.duration)) {
        prevXRef.current = e.clientX;
        return;
      }

      if (prevXRef.current === null) {
        prevXRef.current = e.clientX;
        return;
      }

      const delta = e.clientX - prevXRef.current;
      prevXRef.current = e.clientX;

      if (motionMode === 'ambient') {
        video.pause();
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        idleTimerRef.current = setTimeout(() => {
          if (videoRef.current && (motionMode === 'ambient' || motionMode === 'loop')) {
            videoRef.current.play().catch(() => {});
          }
        }, 1200);
      }

      const duration = video.duration;
      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * duration;
      const clampedTime = Math.max(0, Math.min(duration, targetTimeRef.current + timeOffset));
      targetTimeRef.current = clampedTime;

      if (!isSeekingRef.current) {
        isSeekingRef.current = true;
        video.currentTime = clampedTime;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const currentX = e.touches[0].clientX;
      const video = videoRef.current;
      if (!video || !video.duration || !isFinite(video.duration)) {
        prevXRef.current = currentX;
        return;
      }

      if (prevXRef.current === null) {
        prevXRef.current = currentX;
        return;
      }

      const delta = currentX - prevXRef.current;
      prevXRef.current = currentX;

      if (motionMode === 'ambient') {
        video.pause();
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        idleTimerRef.current = setTimeout(() => {
          if (videoRef.current && (motionMode === 'ambient' || motionMode === 'loop')) {
            videoRef.current.play().catch(() => {});
          }
        }, 1200);
      }

      const duration = video.duration;
      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * duration;
      const clampedTime = Math.max(0, Math.min(duration, targetTimeRef.current + timeOffset));
      targetTimeRef.current = clampedTime;

      if (!isSeekingRef.current) {
        isSeekingRef.current = true;
        video.currentTime = clampedTime;
      }
    };

    const handleMouseLeave = () => {
      prevXRef.current = null;
    };

    const handleTouchEnd = () => {
      prevXRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [motionMode]);

  const handleSeeked = () => {
    const video = videoRef.current;
    if (!video) return;

    isSeekingRef.current = false;
    if (Math.abs(video.currentTime - targetTimeRef.current) > 0.02) {
      isSeekingRef.current = true;
      video.currentTime = targetTimeRef.current;
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      if (motionMode === 'scrub') {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
      targetTimeRef.current = video.currentTime || 0;
    }
  };

  const handleResetVideo = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await clearVideoBlob();
    if (activeBlobUrlRef.current) {
      URL.revokeObjectURL(activeBlobUrlRef.current);
      activeBlobUrlRef.current = null;
    }
    setVideoSrc(DEFAULT_VIDEO_SRC);
    setIsCustomVideo(false);
    setUploadToast('Reset to default video');
    setTimeout(() => setUploadToast(null), 2500);
    onVideoLoadedInfo?.({ isCustom: false });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleApplyFile(e.target.files[0]);
    }
  };

  return (
    <>
      {/* Background Video with dynamic positioning and scale */}
      <video
        ref={videoRef}
        key={videoSrc}
        src={videoSrc}
        poster={POSTER_SRC}
        muted
        loop
        playsInline
        preload="auto"
        onSeeked={handleSeeked}
        onLoadedMetadata={handleLoadedMetadata}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          objectFit: 'cover',
          objectPosition: `${horizontalPosition}% ${verticalPosition}%`,
          transform: videoZoom !== 100 ? `scale(${videoZoom / 100})` : 'none',
          transformOrigin: `${horizontalPosition}% ${verticalPosition}%`,
          width: '100%',
          height: '100%',
          backgroundColor: '#237783',
          pointerEvents: 'none',
          transition: 'object-position 0.2s ease-out, transform 0.2s ease-out',
        }}
        aria-hidden="true"
      />

      {/* Drag & Drop Visual Overlay */}
      {isDraggingOver && (
        <div className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none text-white border-4 border-dashed border-white/40 m-4 rounded-3xl animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-3xl mb-4">
            🎬
          </div>
          <p className="text-xl font-medium tracking-tight">Drop your Kling AI video here</p>
          <p className="text-sm text-white/60 mt-1">Replaces background with mouse-scrubbed playback</p>
        </div>
      )}

      {/* Floating Status Toast & Video Adjuster Dock in bottom-right */}
      <div className="fixed bottom-4 right-4 z-30 flex items-center gap-2 pointer-events-auto">
        {uploadToast && (
          <div className="px-3.5 py-1.5 rounded-full bg-black/85 text-white text-xs backdrop-blur-md border border-white/20 shadow-lg animate-fadeIn">
            {uploadToast}
          </div>
        )}

        {/* Adjust Video Controls Button */}
        <button
          onClick={() => setShowAdjustPanel((prev) => !prev)}
          title="Adjust background video framing & motion"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs backdrop-blur-md border shadow-sm transition-all duration-200 cursor-pointer ${
            showAdjustPanel
              ? 'bg-[#facc15] text-black border-[#facc15] font-semibold'
              : 'bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border-white/20'
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M6 3.5V6L7.5 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span>Adjust Video</span>
        </button>

        {/* Replace Video File Input */}
        <label
          title="Upload or replace background video (.mp4)"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white text-xs backdrop-blur-md border border-white/20 shadow-sm cursor-pointer transition-colors duration-200"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 2V8M3 5L6 2L9 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 9.5H10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span>{isCustomVideo ? 'Change Video' : 'Replace Video'}</span>
          <input
            type="file"
            accept="video/*,.mp4,.webm,.mov"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {isCustomVideo && (
          <button
            onClick={handleResetVideo}
            title="Reset to default video"
            className="px-2.5 py-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white/60 hover:text-white text-xs backdrop-blur-md border border-white/20 cursor-pointer transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Adjust Video Drawer / Popover */}
      {showAdjustPanel && (
        <div
          className="fixed bottom-14 right-4 z-40 w-72 bg-neutral-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl text-white text-xs animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
            <span className="font-semibold tracking-wide flex items-center gap-1.5">
              <span>🎬</span>
              <span>Framing & Motion</span>
            </span>
            <button
              onClick={() => setShowAdjustPanel(false)}
              className="text-white/50 hover:text-white text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3.5">
            {/* Horizontal Framing Presets */}
            <div>
              <div className="flex justify-between items-center mb-1.5 text-white/70">
                <span>Character Framing (X)</span>
                <span className="font-mono text-[11px] text-[#facc15]">{horizontalPosition}%</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 mb-2">
                <button
                  onClick={() => setHorizontalPosition(35)}
                  className={`py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                    horizontalPosition === 35 ? 'bg-[#facc15] text-black font-semibold' : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  Focus (35%)
                </button>
                <button
                  onClick={() => setHorizontalPosition(50)}
                  className={`py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                    horizontalPosition === 50 ? 'bg-white text-black font-semibold' : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  Center (50%)
                </button>
                <button
                  onClick={() => setHorizontalPosition(64)}
                  className={`py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                    horizontalPosition === 64 ? 'bg-white text-black font-semibold' : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  Right (64%)
                </button>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={horizontalPosition}
                onChange={(e) => setHorizontalPosition(Number(e.target.value))}
                className="w-full accent-[#facc15] cursor-pointer"
              />
            </div>

            {/* Vertical Alignment */}
            <div>
              <div className="flex justify-between items-center mb-1.5 text-white/70">
                <span>Vertical Framing (Y)</span>
                <span className="font-mono text-[11px] text-[#facc15]">{verticalPosition}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="80"
                value={verticalPosition}
                onChange={(e) => setVerticalPosition(Number(e.target.value))}
                className="w-full accent-[#facc15] cursor-pointer"
              />
            </div>

            {/* Scale / Zoom */}
            <div>
              <div className="flex justify-between items-center mb-1.5 text-white/70">
                <span>Scale / Zoom</span>
                <span className="font-mono text-[11px] text-[#facc15]">{videoZoom}%</span>
              </div>
              <div className="flex gap-1.5">
                {[100, 108, 118].map((zoom) => (
                  <button
                    key={zoom}
                    onClick={() => setVideoZoom(zoom)}
                    className={`flex-1 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                      videoZoom === zoom ? 'bg-[#facc15] text-black font-semibold' : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {zoom}%
                  </button>
                ))}
              </div>
            </div>

            {/* Motion Mode */}
            <div>
              <div className="text-white/70 mb-1.5">Playback Mode</div>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => setMotionMode('ambient')}
                  title="Subtle ambient play, scrubs on mouse movement"
                  className={`py-1.5 px-1 rounded-md text-[11px] text-center transition-colors cursor-pointer ${
                    motionMode === 'ambient' ? 'bg-[#facc15] text-black font-semibold' : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  Ambient + Scrub
                </button>
                <button
                  onClick={() => setMotionMode('scrub')}
                  title="Only advances with mouse position"
                  className={`py-1.5 px-1 rounded-md text-[11px] text-center transition-colors cursor-pointer ${
                    motionMode === 'scrub' ? 'bg-[#facc15] text-black font-semibold' : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  Mouse Only
                </button>
                <button
                  onClick={() => setMotionMode('loop')}
                  title="Continuous smooth loop"
                  className={`py-1.5 px-1 rounded-md text-[11px] text-center transition-colors cursor-pointer ${
                    motionMode === 'loop' ? 'bg-[#facc15] text-black font-semibold' : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  Continuous
                </button>
              </div>
            </div>

            {/* Reset to defaults button */}
            <div className="pt-2 border-t border-white/10 flex justify-between items-center">
              <button
                onClick={() => {
                  setHorizontalPosition(35);
                  setVerticalPosition(50);
                  setVideoZoom(100);
                  setMotionMode('ambient');
                }}
                className="text-[11px] text-white/50 hover:text-white underline cursor-pointer"
              >
                Reset Framing Defaults
              </button>
              <button
                onClick={() => setShowAdjustPanel(false)}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-full text-[11px] font-medium cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
