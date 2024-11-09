import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { OUTPUT_FORMATS, ANIMATION_CONFIG, DATA_SOURCES } from '../config/animation.config';
import { calculateDataPaths, calculateTubePath } from '../utils/pathCalculations';
import { useParticleSystem } from '../hooks/useParticleSystem';
import * as Icons from 'lucide-react';
import IsometricPyramid from './IsometricPyramid';

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
    
    paths.forEach((path: string, index: number) => {
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
    <div ref={containerRef} className="relative w-full h-screen bg-background overflow-hidden">
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
                  strokeWidth: 20 - (index * 2),
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
              strokeWidth="15"
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

      {/* Central Machine with Pyramid Icon */}
      <div 
        ref={machineRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 z-10 flex items-center justify-center"
      >
        <div className="relative">
          {/* Background glow */}
          <div className="absolute inset-0 blur-xl bg-[#1D9C9C]/20 rounded-full" />
          
          {/* Pyramid icon */}
          <div className="relative">
            {/* Pyramid Icon with animation */}
            <IsometricPyramid 
              className="w-40 h-40 text-[#1D9C9C] transform transition-all duration-500 pyramid-icon"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(29, 156, 156, 0.4))'
              }}
            />
            
            {/* Center pulse */}
            <div 
              className="absolute inset-0 rounded-full animate-pulse"
              style={{ 
                background: 'radial-gradient(circle, rgba(29, 156, 156, 0.3) 0%, rgba(29, 156, 156, 0) 70%)'
              }} 
            />
          </div>
        </div>
      </div>

      {/* Data Sources in circular pattern */}
      {DATA_SOURCES.map((source, index) => {
        // Calculate position in circle, leaving a space at the bottom
        const totalAngle = 2 * Math.PI - (120 * Math.PI / 180); // Total angle minus 120 degrees
        const angleOffset = -Math.PI / 2; // Start at 12 o'clock (-90 degrees)
        const startAngle = angleOffset - (totalAngle / 2); // Distribute evenly around the circle
        const angle = startAngle + (index * (totalAngle / DATA_SOURCES.length));
        const radius = 200;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <div 
            key={source.type}
            className="data-source absolute flex flex-col items-center gap-2"
            style={{ 
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
            }}
          >
            {React.createElement(Icons[source.icon as keyof typeof Icons] as React.ComponentType<any>, {
              className: `w-12 h-12 ${source.color} relative z-20`
            })}
            <span className={`${source.color} text-sm font-medium`}>
              {source.label}
            </span>
            <div 
              className={`particle absolute w-4 h-4 rounded-full scale-0 z-5`}
              style={{
                backgroundColor: source.color.includes('blue') ? '#2563eb' : 
                                source.color.includes('green') ? '#16a34a' :
                                source.color.includes('purple') ? '#9333ea' :
                                source.color.includes('yellow') ? '#ca8a04' :
                                source.color.includes('cyan') ? '#0891b2' :
                                source.color.includes('rose') ? '#e11d48' : '#1D9C9C',
                opacity: 0,
                filter: 'blur(4px)',
                boxShadow: '0 0 15px currentColor'
              }}
            />
          </div>
        );
      })}

      {/* Multi-format Output Container */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4">
        {/* Company Container - Hexagonal shape */}
        <div className="relative">
          {/* Background container with gradient - further reduced size */}
          <div className="w-36 h-36 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1D9C9C]/10 to-[#105069]/10 
                            backdrop-blur-sm rounded-xl border border-[#1D9C9C]/20
                            shadow-[0_0_10px_rgba(29,156,156,0.15)]">
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