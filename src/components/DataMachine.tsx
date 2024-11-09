import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { FileJson, FileSpreadsheet, FileImage, FileCode, Globe2, FileText } from 'lucide-react';
import { OUTPUT_FORMATS, ANIMATION_CONFIG } from '../config/animation.config';
import { calculateDataPaths, calculateTubePath } from '../utils/pathCalculations';
import { useParticleSystem } from '../hooks/useParticleSystem';

// Register the plugin
gsap.registerPlugin(MotionPathPlugin);

const DataMachine = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const machineRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { createParticle, createOutputParticle, clearParticles } = useParticleSystem();

  // Function to calculate path coordinates based on container size
  const calculatePaths = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    
    const paths = calculateDataPaths(width, height);
    
    paths.forEach((path, index) => {
      const pathElement = container.querySelector(`#path-${index}`) as SVGPathElement;
      if (pathElement) {
        pathElement.setAttribute('d', path);
      }
    });
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Get current container dimensions
      if (!containerRef.current) return;
      // Clear all particle tracking
      clearParticles(containerRef.current);

      // Remove all existing particles from DOM
      containerRef.current.querySelectorAll('.particle').forEach(p => p.remove());
      containerRef.current.querySelectorAll('.output-particle').forEach(p => p.remove());
      
      // Kill existing animations
      if (timeline.current) {
        timeline.current.kill();
      }

      // Update particle paths
      calculatePaths();
      
      // Restart animations
      initializeAnimations();
    };

    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Initial calculation
    calculatePaths();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const initializeAnimations = () => {
    if (!containerRef.current || !machineRef.current) return;

    // Existing particle animations
    const sources = containerRef.current.querySelectorAll('.data-source');
    sources.forEach((source, index) => {
      gsap.delayedCall(
        index * gsap.utils.random(ANIMATION_CONFIG.sources.startDelay.min, ANIMATION_CONFIG.sources.startDelay.max),
        () => createParticle(source, index)
      );
    });

    // Optional: Add GSAP animations for the rings
    const rings = machineRef.current.querySelectorAll('.ring');
    rings.forEach((ring, index) => {
      gsap.to(ring, {
        rotate: index % 2 === 0 ? 360 : -360,
        duration: 4 + index * 2,
        repeat: -1,
        ease: "none"
      });
    });
  };

  // Initial animation setup
  useEffect(() => {
    initializeAnimations();
    
    return () => {
      if (timeline.current) {
        timeline.current.kill();
      }
    };
  }, []);

  useEffect(() => {
    const outputs = ['CSV', 'JSON', 'API', 'Database'];
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % outputs.length);
    }, 3000); // Changed to 3000ms for slower transitions

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const createParticles = () => {
      const sources: Array<'api' | 'geospatial' | 'pdf'> = ['api', 'geospatial', 'pdf'];
      const randomSource = sources[Math.floor(Math.random() * sources.length)];
      createOutputParticle(randomSource, containerRef.current!);
    };

    const particleInterval = setInterval(createParticles, 250);

    return () => {
      clearInterval(particleInterval);
    };
  }, [createOutputParticle]);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-gray-900 overflow-hidden">
      {/* Add a wrapper div for SVG and particles with lower z-index */}
      <div className="absolute inset-0 z-0">
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {/* Tunnel Effect */}
          <g className="tunnel-effect">
            <defs>
              <linearGradient id="tunnelGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1D9C9C" stopOpacity="0.1"/>
                <stop offset="50%" stopColor="#1D9C9C" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#105069" stopOpacity="0.1"/>
              </linearGradient>
              
              <filter id="tunnelGlow">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feComposite in="SourceGraphic" in2="blur" operator="over"/>
              </filter>
            </defs>

            {/* Multiple tunnel layers */}
            {[0, 1, 2].map((index) => (
              <path
                key={`tunnel-${index}`}
                d={calculateTubePath(window.innerWidth, window.innerHeight)}
                className="tunnel-layer"
                style={{
                  fill: "none",
                  stroke: "url(#tunnelGradient)",
                  strokeWidth: 8 - (index * 2),
                  opacity: 0.6 - (index * 0.15),
                  filter: "url(#tunnelGlow)"
                }}
              />
            ))}

            {/* Animated flow lines */}
            <path
              d={calculateTubePath(window.innerWidth, window.innerHeight)}
              className="tunnel-flow"
              strokeDasharray="4 12"
              strokeWidth="2"
              stroke="#1D9C9C"
              fill="none"
            />
          </g>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <path
              key={index}
              id={`path-${index}`}
              stroke="#4F46E5"
              strokeWidth={ANIMATION_CONFIG.paths.strokeWidth}
              fill="none"
              filter="url(#glow)"
              className="path-line"
              style={{ opacity: ANIMATION_CONFIG.paths.opacity }}
            />
          ))}
        </svg>
      </div>

      {/* Update machine div with inner rings */}
      <div 
        ref={machineRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-xl transform rotate-45 shadow-2xl z-10"
        style={{ 
          perspective: '1000px',
          filter: 'drop-shadow(0 0 20px rgba(29, 156, 156, 0.4))',
          backgroundColor: '#1D9C9C'
        }}
      >
        <div className="absolute inset-0 rounded-xl border-2 border-[#1D9C9C]/50"
             style={{ background: 'linear-gradient(135deg, #1D9C9C 0%, #105069 100%)' }}>
          {/* Inner mechanism container */}
          <div className="absolute inset-4 border-2 border-[#1D9C9C]/50 rounded-lg overflow-hidden">
            {/* Animated rings */}
            <div className="absolute inset-0 rounded-lg">
              {/* Outer ring */}
              <div className="absolute inset-2 border-4 border-[#1D9C9C]/30 rounded-full animate-[spin_8s_linear_infinite]" />
              {/* Middle ring */}
              <div className="absolute inset-6 border-4 border-[#1D9C9C]/40 rounded-full animate-[spin_6s_linear_infinite_reverse]" />
              {/* Inner ring */}
              <div className="absolute inset-10 border-4 border-[#105069]/50 rounded-full animate-[spin_4s_linear_infinite]" />
              {/* Center pulse */}
              <div className="absolute inset-12 rounded-full animate-pulse"
                   style={{ backgroundColor: 'rgba(29, 156, 156, 0.5)' }} />
            </div>
            {/* Overlay gradient */}
            <div className="absolute inset-0 rounded-lg"
                 style={{ background: 'linear-gradient(135deg, rgba(29, 156, 156, 0.2), rgba(16, 80, 105, 0.2))' }}></div>
          </div>
        </div>
      </div>

      {/* Data Sources - icons moved outward, particles stay at original positions */}
      <div className="data-source absolute flex flex-col items-center gap-2" 
           style={{ top: '15%', left: '15%', transform: 'translate(-20px, -20px)' }}>
        <FileJson className="w-12 h-12 text-blue-400 relative z-20" />
        <span className="text-blue-400 text-sm font-medium">JSON Data</span>
        <div className="particle absolute w-4 h-4 bg-blue-400 rounded-full scale-0 opacity-0 z-5" 
             style={{ transform: 'translate(20px, 20px)' }}></div>
      </div>
      <div className="data-source absolute flex flex-col items-center gap-2" 
           style={{ top: '15%', right: '15%', transform: 'translate(20px, -20px)' }}>
        <FileSpreadsheet className="w-12 h-12 text-green-400 relative z-20" />
        <span className="text-green-400 text-sm font-medium">Spreadsheet</span>
        <div className="particle absolute w-4 h-4 bg-green-400 rounded-full scale-0 opacity-0 z-5" 
             style={{ transform: 'translate(-20px, 20px)' }}></div>
      </div>
      <div className="data-source absolute flex flex-col items-center gap-2" style={{ bottom: '12%', left: '12%' }}>
        <FileImage className="w-12 h-12 text-purple-400 relative z-20" />
        <span className="text-purple-400 text-sm font-medium">Image Data</span>
        <div className="particle absolute w-4 h-4 bg-purple-400 rounded-full scale-0 opacity-0 z-5"></div>
      </div>
      <div className="data-source absolute flex flex-col items-center gap-2" style={{ bottom: '12%', right: '12%' }}>
        <FileCode className="w-12 h-12 text-yellow-400 relative z-20" />
        <span className="text-yellow-400 text-sm font-medium">HTML</span>
        <div className="particle absolute w-4 h-4 bg-yellow-400 rounded-full scale-0 opacity-0 z-5"></div>
      </div>

      {/* Geospatial Data Source */}
      <div className="data-source absolute flex flex-col items-center gap-2" 
           style={{ top: '50%', right: '12%', transform: 'translateY(-50%)' }}>
        <Globe2 className="w-12 h-12 text-cyan-400 relative z-20" />
        <span className="text-cyan-400 text-sm font-medium">Geospatial</span>
        <div className="particle absolute w-4 h-4 bg-cyan-400 rounded-full scale-0 opacity-0 z-5"></div>
      </div>

      {/* PDF Files Source */}
      <div className="data-source absolute flex flex-col items-center gap-2" 
           style={{ top: '12%', left: '50%', transform: 'translateX(-50%)' }}>
        <FileText className="w-12 h-12 text-rose-400 relative z-20" />
        <span className="text-rose-400 text-sm font-medium">PDF Files</span>
        <div className="particle absolute w-4 h-4 bg-rose-400 rounded-full scale-0 opacity-0 z-5"></div>
      </div>

      {/* Multi-format Output Container */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4">
        {/* Company Container - Hexagonal shape */}
        <div className="relative">
          {/* Background container with gradient - further reduced size */}
          <div className="w-36 h-36 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1D9C9C]/20 to-[#105069]/20 
                            backdrop-blur-sm rounded-xl border border-[#1D9C9C]/30
                            shadow-[0_0_15px_rgba(29,156,156,0.3)]">
              {/* Inner content - minimal padding */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-2 p-2">
                  {OUTPUT_FORMATS.map((format, index) => {
                    const Icon = format.icon;
                    return (
                      <div key={format.type} 
                           className={`relative transition-all duration-500 ease-out
                                      ${index === currentIndex ? 'scale-110' : 'scale-90'}`}>
                        <div className="output-icon-container">
                          {/* Icon - increased size while maintaining container size */}
                          <Icon 
                            className={`output-icon w-12 h-12 ${index === currentIndex ? 'active' : ''}`}
                            style={{
                              transition: 'all 0.5s ease',
                              transformOrigin: 'center',
                              color: index === currentIndex ? '#1D9C9C' : '#105069'
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataMachine;