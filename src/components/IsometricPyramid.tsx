import React from 'react';

interface PyramidFace {
  points: string;
  color: string;
  className?: string;
  gradientId: string;
}

const IsometricPyramid: React.FC = () => {
  const size = 100;
  const height = 120;
  
  const faces: PyramidFace[] = [
    {
      points: `${size/2},0 0,${size} ${size},${size}`,
      color: '#1D9C9C',
      className: 'pyramid-face front',
      gradientId: 'frontGradient'
    },
    {
      points: `0,${size} ${size/2},0 ${size/2},${height}`,
      color: '#16817A',
      className: 'pyramid-face left',
      gradientId: 'leftGradient'
    },
    {
      points: `${size},${size} ${size/2},0 ${size/2},${height}`,
      color: '#105069',
      className: 'pyramid-face right',
      gradientId: 'rightGradient'
    }
  ];

  return (
    <div className="isometric-pyramid">
      <svg 
        viewBox={`0 0 ${size} ${size + height}`} 
        className="w-full h-full"
      >
        <defs>
          {/* Gradient definitions */}
          <linearGradient id="frontGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1D9C9C" stopOpacity="1" />
            <stop offset="100%" stopColor="#1D9C9C" stopOpacity="0.8" />
          </linearGradient>
          
          <linearGradient id="leftGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#16817A" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#16817A" stopOpacity="0.7" />
          </linearGradient>
          
          <linearGradient id="rightGradient" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#105069" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#105069" stopOpacity="0.7" />
          </linearGradient>

          <filter id="pyramidGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {faces.map((face, index) => (
          <polygon
            key={index}
            points={face.points}
            fill={`url(#${face.gradientId})`}
            className={`${face.className} transition-all duration-300`}
          />
        ))}
      </svg>
    </div>
  );
};

export default IsometricPyramid; 