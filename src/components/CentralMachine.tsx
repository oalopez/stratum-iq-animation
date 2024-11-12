import React from 'react';
import IsometricPyramid from './IsometricPyramid';
import { useScalingFactor } from '../hooks/useScalingFactor';

interface CentralMachineProps {
  machineRef: React.RefObject<HTMLDivElement>;
}

const CentralMachine: React.FC<CentralMachineProps> = ({ machineRef }) => {
  const scalingFactor = useScalingFactor();
  
  return (
    <div 
      ref={machineRef}
      className="absolute left-1/2 top-1/2 w-64 h-64 z-10 flex items-center justify-center"
      style={{ 
        transform: `translate(-50%, -50%) scale(${scalingFactor})`,
        transformOrigin: 'center center'
      }}
    >
      <div className="relative">
        <div 
          className="absolute inset-0 -inset-4 blur-lg bg-[#1D9C9C]/10 rounded-full" 
          style={{
            background: 'radial-gradient(circle at center, rgba(29, 156, 156, 0.15) 0%, rgba(29, 156, 156, 0) 70%)',
            transform: 'scale(1.2)',
          }} 
        />
        
        <div className="relative">
          <IsometricPyramid 
            className="w-40 h-40 text-[#1D9C9C] transform transition-all duration-500 pyramid-icon"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(29, 156, 156, 0.4))'
            }}
          />
          
          <div 
            className="absolute inset-0 rounded-full animate-pulse"
            style={{ 
              background: 'radial-gradient(circle, rgba(29, 156, 156, 0.15) 0%, rgba(29, 156, 156, 0) 10%)'
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default CentralMachine; 