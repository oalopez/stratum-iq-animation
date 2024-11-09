import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ANIMATION_CONFIG } from '../config/animation.config';
import { calculateDataPaths } from '../utils/pathCalculations';
import { useParticleSystem } from '../hooks/useParticleSystem';
import OutputContainer from './OutputContainer';
import CentralMachine from './CentralMachine';
import DataSources from './DataSources';
import Tunnel from './Tunnel';

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
      {/* SVG wrapper div */}
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
          
          <Tunnel width={window.innerWidth} height={window.innerHeight} />
          
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

      <CentralMachine machineRef={machineRef} />
      <DataSources />
      <OutputContainer currentIndex={currentIndex} />
    </div>
  );
};

export default DataMachine;