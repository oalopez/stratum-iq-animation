import React from 'react';
import { calculateDataPaths } from '../utils/pathCalculations';

interface ParticlePathsProps {
  width: number;
  height: number;
  radius: number;
}

const ParticlePaths: React.FC<ParticlePathsProps> = ({ width, height, radius }) => {
  const paths = calculateDataPaths(width, height, radius);

  return (
    <>
      {paths.map((path, index) => (
        <path
          key={index}
          id={`path-${index}`}
          d={path}
          stroke="#4F46E5"
          strokeWidth={1}
          fill="none"
          className="path-line"
          style={{ opacity: 0 }}
        />
      ))}
    </>
  );
};

export default ParticlePaths; 