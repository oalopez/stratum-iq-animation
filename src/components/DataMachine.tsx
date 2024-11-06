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

  useEffect(() => {
    if (!containerRef.current) return;

    timeline.current = gsap.timeline({ repeat: -1 });
    
    // Enhanced machine pulse animation
    gsap.to(machineRef.current, {
      boxShadow: '0 0 50px rgba(99, 102, 241, 0.6)',
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });

    // Data source animations
    const sources = containerRef.current.querySelectorAll('.data-source');
    sources.forEach((source, index) => {
      const particle = source.querySelector('.particle');
      
      // Create recursive function for random particle generation
      const createParticle = () => {
        const clonedParticle = particle?.cloneNode(true) as HTMLElement;
        source.appendChild(clonedParticle);
        
        // Random variations for more organic movement
        const randomDuration = gsap.utils.random(2.5, 3.5);
        const randomScale = gsap.utils.random(1.2, 1.8);
        const randomOpacity = gsap.utils.random(0.6, 0.9);
        
        gsap.fromTo(clonedParticle,
          { scale: 0, opacity: 0 },
          {
            scale: randomScale,
            opacity: randomOpacity,
            motionPath: {
              path: `#path-${index}`,
              align: `#path-${index}`,
              autoRotate: true,
              alignOrigin: [0.5, 0.5]
            },
            duration: randomDuration,
            ease: "none",
            onComplete: () => {
              clonedParticle.remove(); // Clean up DOM
            }
          }
        );

        // Schedule next particle with random delay
        gsap.delayedCall(gsap.utils.random(0.8, 1.5), createParticle);
      };

      // Start the particle generation with random initial delay
      gsap.delayedCall(index * gsap.utils.random(0.3, 0.7), createParticle);
    });

    return () => {
      timeline.current?.kill();
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
          {/* Curved, glowing paths */}
          <path 
            id="path-0" 
            d="M150,100 C250,150 350,200 500,300" 
            stroke="#4F46E5" 
            strokeWidth="3" 
            fill="none" 
            filter="url(#glow)" 
            className="path-line"
          />
          <path 
            id="path-1" 
            d="M850,100 C750,150 650,200 500,300" 
            stroke="#4F46E5" 
            strokeWidth="3" 
            fill="none" 
            filter="url(#glow)" 
            className="path-line"
          />
          <path 
            id="path-2" 
            d="M150,500 C250,450 350,400 500,300" 
            stroke="#4F46E5" 
            strokeWidth="3" 
            fill="none" 
            filter="url(#glow)" 
            className="path-line"
          />
          <path 
            id="path-3" 
            d="M850,500 C750,450 650,400 500,300" 
            stroke="#4F46E5" 
            strokeWidth="3" 
            fill="none" 
            filter="url(#glow)" 
            className="path-line"
          />
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

      {/* Data Sources - Keep icons above (z-20) but particles below machine */}
      <div className="data-source absolute top-20 left-20">
        <FileJson className="w-12 h-12 text-blue-400 relative z-20" />
        <div className="particle absolute w-4 h-4 bg-blue-400 rounded-full scale-0 opacity-0 z-5"></div>
      </div>
      <div className="data-source absolute top-20 right-20">
        <FileSpreadsheet className="w-12 h-12 text-green-400 relative z-20" />
        <div className="particle absolute w-4 h-4 bg-green-400 rounded-full scale-0 opacity-0 z-5"></div>
      </div>
      <div className="data-source absolute bottom-20 left-20">
        <FileImage className="w-12 h-12 text-purple-400 relative z-20" />
        <div className="particle absolute w-4 h-4 bg-purple-400 rounded-full scale-0 opacity-0 z-5"></div>
      </div>
      <div className="data-source absolute bottom-20 right-20">
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