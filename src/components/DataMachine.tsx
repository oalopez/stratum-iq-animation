import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FileJson, FileSpreadsheet, FileImage, FileCode, FileText, Table2 } from 'lucide-react';

const DataMachine = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const machineRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline>();

  useEffect(() => {
    if (!containerRef.current) return;

    timeline.current = gsap.timeline({ repeat: -1 });
    
    // Machine pulse animation
    gsap.to(machineRef.current, {
      boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)',
      duration: 1,
      repeat: -1,
      yoyo: true
    });

    // Data source animations
    const sources = containerRef.current.querySelectorAll('.data-source');
    sources.forEach((source, index) => {
      const particle = source.querySelector('.particle');
      const delay = index * 0.25;

      timeline.current?.to(particle, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        delay
      }).to(particle, {
        motionPath: {
          path: `#path-${index}`,
          align: "#path-${index}",
          autoRotate: true
        },
        duration: 1.5,
        ease: "power1.inOut"
      }).to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3
      }, "-=0.3");
    });

    return () => {
      timeline.current?.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-gray-900 overflow-hidden">
      {/* SVG Paths */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>
        </defs>
        {/* Define paths for each data source */}
        <path
          id="path-0"
          d="M200,100 Q400,200 500,300"  // Adjusted from original coordinates
          fill="none"
          strokeWidth="8"
          stroke="url(#pathGradient)"
        />
        <path id="path-1" d="M800,100 Q600,200 500,300" stroke="url(#pathGradient)" strokeWidth="8" fill="none" />
        <path id="path-2" d="M200,500 Q400,400 500,300" stroke="url(#pathGradient)" strokeWidth="8" fill="none" />
        <path id="path-3" d="M800,500 Q600,400 500,300" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
      </svg>

      {/* Central Machine */}
      <div 
        ref={machineRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-600 rounded-xl transform rotate-45 shadow-2xl"
        style={{ perspective: '1000px' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl border-2 border-indigo-400/30">
          <div className="absolute inset-4 border-2 border-indigo-400/30 rounded-lg"></div>
        </div>
      </div>

      {/* Data Sources */}
      <div className="data-source absolute top-20 left-40">
        <FileJson className="w-12 h-12 text-blue-400" />
        <div className="particle absolute w-4 h-4 bg-blue-400 rounded-full scale-0 opacity-0"></div>
      </div>
      <div className="data-source absolute top-20 right-40">
        <FileSpreadsheet className="w-12 h-12 text-green-400" />
        <div className="particle absolute w-4 h-4 bg-green-400 rounded-full scale-0 opacity-0"></div>
      </div>
      <div className="data-source absolute bottom-20 left-40">
        <FileImage className="w-12 h-12 text-purple-400" />
        <div className="particle absolute w-4 h-4 bg-purple-400 rounded-full scale-0 opacity-0"></div>
      </div>
      <div className="data-source absolute bottom-20 right-40">
        <FileCode className="w-12 h-12 text-yellow-400" />
        <div className="particle absolute w-4 h-4 bg-yellow-400 rounded-full scale-0 opacity-0"></div>
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