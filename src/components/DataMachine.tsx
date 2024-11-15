import { useRef, useEffect, useState } from 'react';
import { useDataMachineAnimations } from '../hooks/useDataMachineAnimations';
import { useOutputCycling } from '../hooks/useOutputCycling';
import { useScalingFactor } from '../hooks/useScalingFactor';
import OutputContainer from './OutputContainer';
import CentralMachine from './CentralMachine';
import DataSources from './DataSources';
import Tunnel from './Tunnel';
import ParticlePaths from './ParticlePaths';

const DataMachine: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const machineRef = useRef<HTMLDivElement>(null);
  const currentIndex = useOutputCycling();
  const scalingFactor = useScalingFactor();
  const [dimensions, setDimensions] = useState({ 
    width: window.innerWidth,
    height: window.innerHeight 
  });
  const { createOutputParticle } = useDataMachineAnimations(containerRef);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-background overflow-hidden"
      style={{ minWidth: '100vw', minHeight: '100vh' }}
    >
      <div className="absolute inset-0">
        <svg className="w-full h-full" preserveAspectRatio="xMidYMid meet" style={{ pointerEvents: 'none' }}>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <Tunnel width={dimensions.width} height={dimensions.height} scalingFactor={scalingFactor} />
          <ParticlePaths 
            width={dimensions.width} 
            height={dimensions.height} 
            radius={200 * scalingFactor} 
          />
        </svg>
      </div>

      <CentralMachine machineRef={machineRef} />
      <DataSources />
      <OutputContainer currentIndex={currentIndex} createOutputParticle={createOutputParticle} />
    </div>
  );
};

export default DataMachine;