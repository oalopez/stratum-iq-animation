import React from 'react';
import { calculateTubePath } from '../utils/pathCalculations';

interface TunnelProps {
  width: number;
  height: number;
  scalingFactor: number;
}

const Tunnel: React.FC<TunnelProps> = ({ width, height, scalingFactor }) => {
  const tubePath = calculateTubePath(width, height, scalingFactor);

  return (
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
          d={tubePath}
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
        d={tubePath}
        className="tunnel-flow"
        strokeDasharray="4 12"
        strokeWidth="15"
        stroke="#1D9C9C"
        fill="none"
      />
    </g>
  );
};

export default Tunnel; 