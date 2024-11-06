import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { FileJson, FileSpreadsheet, FileImage, FileCode, FileText, Table2, Globe2, Database } from 'lucide-react';

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
      endScale: 0.6,
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
    
    // Update tube path
    const tubePath = container.querySelector('#tube-path') as SVGPathElement;
    if (tubePath) {
      tubePath.setAttribute('d', `M${width/2},${height/2} 
        C${width/2},${height * 0.65} 
        ${width/2},${height * 0.75} 
        ${width/2},${height - 100}`);
    }

    const centerX = width / 2;
    const centerY = height / 2;
    
    // Get icon positions (matching the new positions in JSX)
    const iconPositions = {
      topLeft: { x: width * 0.15, y: height * 0.15 },      // 15% from top-left
      topRight: { x: width * 0.85, y: height * 0.15 },     // 15% from top-right
      bottomLeft: { x: width * 0.15, y: height * 0.85 },   // 15% from bottom-left
      bottomRight: { x: width * 0.85, y: height * 0.85 }   // 15% from bottom-right
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
       ${centerX},${centerY}`,
      
      // Geospatial data path - starting from right middle
      `M${width * 0.88},${height * 0.5} 
       C${width * 0.7},${height * 0.5} 
       ${width * 0.6},${height * 0.5} 
       ${centerX},${centerY}`,
      
      // PDF data path - new path from bottom center
      `M${width * 0.5},${height * 0.12} 
       C${width * 0.5},${height * 0.3} 
       ${width * 0.5},${height * 0.4} 
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
    let currentIndex = 0;

    const rotateOutputs = () => {
      // Remove active class from all elements
      document.querySelectorAll('.output-icon, .output-text').forEach(el => {
        el.classList.remove('active');
      });

      // Add active class to current elements
      document.querySelectorAll('.output-icon')[currentIndex].classList.add('active');
      document.querySelectorAll('.output-text')[currentIndex].classList.add('active');

      // Update index
      currentIndex = (currentIndex + 1) % outputs.length;
    };

    // Initial state
    rotateOutputs();

    // Rotate every 3 seconds
    const interval = setInterval(rotateOutputs, 3000);

    return () => clearInterval(interval);
  }, []);

  const createOutputParticle = (sourceType: 'api' | 'geospatial' | 'pdf') => {
    const particle = document.createElement('div');
    particle.className = `output-particle ${sourceType}`;
    
    // Set initial position at the start of the tube path
    const pathElement = document.querySelector('#tube-path') as SVGPathElement;
    if (!pathElement) return;
    
    const pathLength = pathElement.getTotalLength();
    const startPoint = pathElement.getPointAtLength(0);
    
    particle.style.left = `${startPoint.x}px`;
    particle.style.top = `${startPoint.y}px`;
    
    const container = containerRef.current;
    if (!container) return;

    container.appendChild(particle);
    
    // Animate the particle along the tube path
    gsap.to(particle, {
      motionPath: {
        path: '#tube-path',
        align: '#tube-path',
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
      },
      duration: 1.2 + Math.random() * 0.4,
      ease: "power2.out",
      onComplete: () => {
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

    const particleInterval = setInterval(createParticles, 100);

    return () => {
      clearInterval(particleInterval);
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
          <path
            id="tube-path"
            d={`M${window.innerWidth/2},${window.innerHeight/2} 
                C${window.innerWidth/2},${window.innerHeight * 0.65} 
                ${window.innerWidth/2},${window.innerHeight * 0.75} 
                ${window.innerWidth/2},${window.innerHeight - 100}`}
            stroke="#4F46E5"
            strokeWidth="4"
            fill="none"
            filter="url(#glow)"
            className="tube-line"
            style={{ opacity: 0.8 }}
          />
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
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-600 rounded-xl transform rotate-45 shadow-2xl z-10"
        style={{ 
          perspective: '1000px',
          filter: 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.4))'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl border-2 border-indigo-400/50">
          {/* Inner mechanism container */}
          <div className="absolute inset-4 border-2 border-indigo-400/50 rounded-lg overflow-hidden">
            {/* Animated rings */}
            <div className="absolute inset-0 rounded-lg">
              {/* Outer ring */}
              <div className="absolute inset-2 border-4 border-indigo-400/30 rounded-full animate-[spin_8s_linear_infinite]" />
              {/* Middle ring */}
              <div className="absolute inset-6 border-4 border-indigo-300/40 rounded-full animate-[spin_6s_linear_infinite_reverse]" />
              {/* Inner ring */}
              <div className="absolute inset-10 border-4 border-indigo-200/50 rounded-full animate-[spin_4s_linear_infinite]" />
              {/* Center pulse */}
              <div className="absolute inset-12 bg-indigo-400/50 rounded-full animate-pulse" />
            </div>
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-indigo-500/20 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Data Sources - positioned at 15% from edges */}
      <div className="data-source absolute flex flex-col items-center gap-2" style={{ top: '15%', left: '15%' }}>
        <FileJson className="w-12 h-12 text-blue-400 relative z-20" />
        <span className="text-blue-400 text-sm font-medium">JSON Data</span>
        <div className="particle absolute w-4 h-4 bg-blue-400 rounded-full scale-0 opacity-0 z-5"></div>
      </div>
      <div className="data-source absolute flex flex-col items-center gap-2" style={{ top: '15%', right: '15%' }}>
        <FileSpreadsheet className="w-12 h-12 text-green-400 relative z-20" />
        <span className="text-green-400 text-sm font-medium">Spreadsheet</span>
        <div className="particle absolute w-4 h-4 bg-green-400 rounded-full scale-0 opacity-0 z-5"></div>
      </div>
      <div className="data-source absolute flex flex-col items-center gap-2" style={{ bottom: '15%', left: '15%' }}>
        <FileImage className="w-12 h-12 text-purple-400 relative z-20" />
        <span className="text-purple-400 text-sm font-medium">Image Data</span>
        <div className="particle absolute w-4 h-4 bg-purple-400 rounded-full scale-0 opacity-0 z-5"></div>
      </div>
      <div className="data-source absolute flex flex-col items-center gap-2" style={{ bottom: '15%', right: '15%' }}>
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

      {/* Multi-format Output */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="output-particles-container"></div>
          <div className="output-icon-container">
            <Table2 className="w-16 h-16 text-indigo-400 absolute output-icon" />
            <FileJson className="w-16 h-16 text-indigo-400 absolute output-icon" />
            <FileCode className="w-16 h-16 text-indigo-400 absolute output-icon" />
            <Database className="w-16 h-16 text-indigo-400 absolute output-icon" />
          </div>
        </div>
        <div className="text-indigo-200 font-semibold output-text-container">
          <span className="absolute output-text">CSV</span>
          <span className="absolute output-text">JSON</span>
          <span className="absolute output-text">API</span>
          <span className="absolute output-text">Database</span>
        </div>
      </div>
    </div>
  );
};

export default DataMachine;