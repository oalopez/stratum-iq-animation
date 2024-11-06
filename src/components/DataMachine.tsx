import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { FileJson, FileSpreadsheet, FileImage, FileCode, FileText, Table2 } from 'lucide-react';

// Register the plugin
gsap.registerPlugin(MotionPathPlugin);

const DataMachine = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const machineRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline>();

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
        min: 3,
        max: 4
      },
      // Time between particles from same source
      frequency: {
        min: 1,
        max: 2
      }
    },
    sources: {
      // Initial delay between different sources starting
      startDelay: {
        min: 1,
        max: 2
      }
    },
    paths: {
      // Padding from corners as percentage of container size
      padding: 0.1,
      strokeWidth: 0,
      opacity: 0.4
    }
  };

  // Function to calculate path coordinates based on container size
  const calculatePaths = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Get icon positions (matching the positions in JSX)
    const iconPositions = {
      topLeft: { x: width * 0.1, y: height * 0.1 },      // 10% from top-left
      topRight: { x: width * 0.9, y: height * 0.1 },     // 10% from top-right
      bottomLeft: { x: width * 0.1, y: height * 0.9 },   // 10% from bottom-left
      bottomRight: { x: width * 0.9, y: height * 0.9 }   // 10% from bottom-right
    };

    // Different curve pattern for each path, starting from icon centers
    const paths = [
      // Top left - S-curve
      `M${iconPositions.topLeft.x},${iconPositions.topLeft.y} 
       C${width * 0.1},${height * 0.5} 
       ${width * 0.4},${height * 0.2} 
       ${centerX},${centerY}`,
      
      // Top right - wide arc
      `M${iconPositions.topRight.x},${iconPositions.topRight.y} 
       C${width * 0.9},${height * 0.6} 
       ${width * 0.6},${height * 0.3} 
       ${centerX},${centerY}`,
      
      // Bottom left - tight curve then straight
      `M${iconPositions.bottomLeft.x},${iconPositions.bottomLeft.y} 
       C${width * 0.15},${height * 0.7} 
       ${width * 0.2},${centerY} 
       ${centerX},${centerY}`,
      
      // Bottom right - wavy path
      `M${iconPositions.bottomRight.x},${iconPositions.bottomRight.y} 
       C${width * 0.7},${height * 0.8} 
       ${width * 0.8},${height * 0.4} 
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
      calculatePaths();
      
      // Kill existing animations
      if (timeline.current) {
        timeline.current.kill();
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

    const clonedParticle = particle.cloneNode(true) as HTMLElement;
    source.appendChild(clonedParticle);
    
    const randomDuration = gsap.utils.random(CONFIG.particles.duration.min, CONFIG.particles.duration.max);
    const randomScale = gsap.utils.random(CONFIG.particles.scale.min, CONFIG.particles.scale.max);
    const randomOpacity = gsap.utils.random(CONFIG.particles.opacity.min, CONFIG.particles.opacity.max);
    
    gsap.fromTo(clonedParticle,
      { scale: randomScale, opacity: randomOpacity },
      {
        scale: 0,
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
          clonedParticle.remove();
        }
      }
    );

    gsap.delayedCall(
      gsap.utils.random(CONFIG.particles.frequency.min, CONFIG.particles.frequency.max), 
      () => createParticle(source, index)
    );
  };

  const initializeAnimations = () => {
    if (!containerRef.current) return;

    const sources = containerRef.current.querySelectorAll('.data-source');
    sources.forEach((source, index) => {
      gsap.delayedCall(
        index * gsap.utils.random(CONFIG.sources.startDelay.min, CONFIG.sources.startDelay.max),
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
          {[0, 1, 2, 3].map((index) => (
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

      {/* Update machine div to have higher z-index */}
      <div 
        ref={machineRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-600 rounded-xl transform rotate-45 shadow-2xl z-10"
        style={{ 
          perspective: '1000px',
          filter: 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.4))'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl border-2 border-indigo-400/50">
          <div className="absolute inset-4 border-2 border-indigo-400/50 rounded-lg">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Data Sources - positioned at 10% from edges */}
      <div className="data-source absolute" style={{ top: '10%', left: '10%' }}>
        <FileJson className="w-12 h-12 text-blue-400 relative z-20" />
        <div className="particle absolute w-4 h-4 bg-blue-400 rounded-full scale-0 opacity-0 z-5"></div>
      </div>
      <div className="data-source absolute" style={{ top: '10%', right: '10%' }}>
        <FileSpreadsheet className="w-12 h-12 text-green-400 relative z-20" />
        <div className="particle absolute w-4 h-4 bg-green-400 rounded-full scale-0 opacity-0 z-5"></div>
      </div>
      <div className="data-source absolute" style={{ bottom: '10%', left: '10%' }}>
        <FileImage className="w-12 h-12 text-purple-400 relative z-20" />
        <div className="particle absolute w-4 h-4 bg-purple-400 rounded-full scale-0 opacity-0 z-5"></div>
      </div>
      <div className="data-source absolute" style={{ bottom: '10%', right: '10%' }}>
        <FileCode className="w-12 h-12 text-yellow-400 relative z-20" />
        <div className="particle absolute w-4 h-4 bg-yellow-400 rounded-full scale-0 opacity-0 z-5"></div>
      </div>

      {/* Output */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <Table2 className="w-16 h-16 text-indigo-400" />
        <span className="text-indigo-200 font-semibold">CSV Output</span>
      </div>
    </div>
  );
};

export default DataMachine;