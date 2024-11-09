import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { FileJson, FileSpreadsheet, FileImage, FileCode, Globe2, FileText } from 'lucide-react';
import { OUTPUT_FORMATS } from '../config/animation.config';

// Register the plugin
gsap.registerPlugin(MotionPathPlugin);

const DataMachine = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const machineRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline>();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Animation configuration parameters
  const CONFIG = {
    particles: {
      scale: {
        min: 1.2,
        max: 1.6
      },
      opacity: {
        min: 0.6,
        max: 0.8
      },
      duration: {
        min: 4,
        max: 5
      },
      endScale: 0.6,
      // Time between particles from same source
      frequency: {
        min: 2,
        max: 3
      }
    },
    sources: {
      // Initial delay between different sources starting
      startDelay: {
        min: 2,
        max: 3
      }
    },
    paths: {
      // Padding from corners as percentage of container size
      padding: 0.1,
      strokeWidth: 0,
      opacity: 0.4
    }
  };

  const PARTICLE_LIMITS = {
    sources: {
      maxPerSource: 3,
      total: 18  // 6 sources × 3 particles each
    },
    output: {
      max: 5
    }
  };

  const particleTracking = {
    sources: new Map<number, HTMLElement[]>(),
    output: new Set<HTMLElement>()
  };

  // Function to calculate path coordinates based on container size
  const calculatePaths = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    
    // Path starting points (moved to 20% instead of 25%)
    const pathStarts = {
      topLeft: { x: width * 0.20, y: height * 0.20 },     // Changed from 0.25 to 0.20
      topRight: { x: width * 0.80, y: height * 0.20 },    // Changed from 0.75 to 0.80
      bottomLeft: { x: width * 0.20, y: height * 0.80 },  // Changed from 0.25 to 0.20
      bottomRight: { x: width * 0.80, y: height * 0.80 }, // Changed from 0.75 to 0.80
    };

    const centerX = width / 2;
    const centerY = height / 2;

    // Adjust control points accordingly
    const paths = [
      // Top left - S-curve
      `M${pathStarts.topLeft.x},${pathStarts.topLeft.y} 
       C${width * 0.25},${height * 0.35} 
       ${width * 0.35},${height * 0.25} 
       ${centerX},${centerY}`,
      
      // Top right - wide arc
      `M${pathStarts.topRight.x},${pathStarts.topRight.y} 
       C${width * 0.75},${height * 0.35} 
       ${width * 0.65},${height * 0.25} 
       ${centerX},${centerY}`,
      
      // Bottom left - tight curve
      `M${pathStarts.bottomLeft.x},${pathStarts.bottomLeft.y} 
       C${width * 0.25},${height * 0.65} 
       ${width * 0.35},${height * 0.75} 
       ${centerX},${centerY}`,
      
      // Bottom right - wavy path
      `M${pathStarts.bottomRight.x},${pathStarts.bottomRight.y} 
       C${width * 0.75},${height * 0.65} 
       ${width * 0.65},${height * 0.75} 
       ${centerX},${centerY}`,
      
      // Geospatial data path
      `M${width * 0.80},${height * 0.5} 
       C${width * 0.70},${height * 0.5} 
       ${width * 0.65},${height * 0.5} 
       ${centerX},${centerY}`,
      
      // PDF data path
      `M${width * 0.5},${height * 0.20} 
       C${width * 0.5},${height * 0.30} 
       ${width * 0.5},${height * 0.35} 
       ${centerX},${centerY}`
    ];

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
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;

      // Clear all particle tracking
      particleTracking.sources.clear();
      particleTracking.output.clear();

      // Remove all existing particles from DOM
      containerRef.current.querySelectorAll('.particle').forEach(p => p.remove());
      containerRef.current.querySelectorAll('.output-particle').forEach(p => p.remove());
      
      // Kill existing animations
      if (timeline.current) {
        timeline.current.kill();
      }

      // Update particle paths
      calculatePaths();
      
      // Update tube path
      const tubePath = document.querySelector('#tube-path') as SVGPathElement;
      if (tubePath) {
        tubePath.setAttribute('d', calculateTubePath(width, height));
      }
      
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

  // Separate function for animations with fewer particles
  const createParticle = (source: Element, index: number) => {
    const particle = source.querySelector('.particle');
    if (!particle) return;

    // Check if we've reached the limit for this source
    const existingParticles = particleTracking.sources.get(index) || [];
    if (existingParticles.length >= PARTICLE_LIMITS.sources.maxPerSource) {
      return;
    }

    const clonedParticle = particle.cloneNode(true) as HTMLElement;
    source.appendChild(clonedParticle);
    
    // Track the new particle
    particleTracking.sources.set(index, [...existingParticles, clonedParticle]);
    
    const randomDuration = gsap.utils.random(CONFIG.particles.duration.min, CONFIG.particles.duration.max);
    const randomScale = gsap.utils.random(CONFIG.particles.scale.min, CONFIG.particles.scale.max);
    const randomOpacity = gsap.utils.random(CONFIG.particles.opacity.min, CONFIG.particles.opacity.max);
    
    gsap.fromTo(clonedParticle,
      { scale: randomScale, opacity: randomOpacity },
      {
        scale: 0.6,
        opacity: 0,
        motionPath: {
          path: `#path-${index}`,
          align: `#path-${index}`,
          autoRotate: true,
          alignOrigin: [0.5, 0.5]
        },
        duration: randomDuration,
        ease: "none",
        onComplete: () => {
          // Remove from tracking and DOM
          const particles = particleTracking.sources.get(index) || [];
          particleTracking.sources.set(
            index,
            particles.filter(p => p !== clonedParticle)
          );
          clonedParticle.remove();
        }
      }
    );

    // Schedule next particle only if below limit
    if (existingParticles.length < PARTICLE_LIMITS.sources.maxPerSource) {
      gsap.delayedCall(
        gsap.utils.random(CONFIG.particles.frequency.min, CONFIG.particles.frequency.max), 
        () => createParticle(source, index)
      );
    }
  };

  const initializeAnimations = () => {
    if (!containerRef.current || !machineRef.current) return;

    // Existing particle animations
    const sources = containerRef.current.querySelectorAll('.data-source');
    sources.forEach((source, index) => {
      gsap.delayedCall(
        index * gsap.utils.random(CONFIG.sources.startDelay.min, CONFIG.sources.startDelay.max),
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

  const createOutputParticle = (sourceType: 'api' | 'geospatial' | 'pdf') => {
    // Check if we've reached the output particle limit
    if (particleTracking.output.size >= PARTICLE_LIMITS.output.max) {
      return;
    }

    const particle = document.createElement('div');
    particle.className = `output-particle ${sourceType}`;
    
    const pathElement = document.querySelector('#tube-path') as SVGPathElement;
    if (!pathElement) return;
    
    const startPoint = pathElement.getPointAtLength(0);
    particle.style.transform = `translate(${startPoint.x}px, ${startPoint.y}px)`;
    
    const container = containerRef.current;
    if (!container) return;

    container.appendChild(particle);
    particleTracking.output.add(particle);
    
    gsap.to(particle, {
      motionPath: {
        path: '#tube-path',
        align: '#tube-path',
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
      },
      duration: 1.5 + Math.random() * 0.4,
      ease: "power2.out",
      onComplete: () => {
        particleTracking.output.delete(particle);
        particle.remove();
      }
    });
  };

  // Create particles at intervals
  useEffect(() => {
    const createParticles = () => {
      const sources: Array<'api' | 'geospatial' | 'pdf'> = ['api', 'geospatial', 'pdf'];
      const randomSource = sources[Math.floor(Math.random() * sources.length)];
      createOutputParticle(randomSource);
    };

    // Increased interval from 100ms to 250ms
    const particleInterval = setInterval(createParticles, 250);

    return () => {
      clearInterval(particleInterval);
    };
  }, []);

  const calculateTubePath = (width: number, height: number) => {
    const startX = width / 2;
    const startY = height / 2;
    const endY = height - 180;
    
    return `
      M ${startX},${startY}
      C ${startX},${startY + 50}
        ${startX - 20},${endY - 50}
        ${startX},${endY}
    `;
  };

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
              strokeWidth={CONFIG.paths.strokeWidth}
              fill="none"
              filter="url(#glow)"
              className="path-line"
              style={{ opacity: CONFIG.paths.opacity }}
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