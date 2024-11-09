import React from 'react';

interface PyramidFace {
  points: string;
  gradientId: string;
  className: string;
}

interface IsometricPyramidProps {
  className?: string;
  style?: React.CSSProperties;
}

const IsometricPyramid: React.FC<IsometricPyramidProps> = ({ className, style }) => {
  // Base size of the pyramid (square base)
  const baseSize = 100;
  
  // Calculate edge length (1.2x the base edge)
  const edgeLength = baseSize * 1;
  
  // Calculate peak height using Pythagorean theorem
  const peakHeight = Math.floor(Math.sqrt(Math.pow(edgeLength, 2) - Math.pow(baseSize/2, 2)));
  
  // Center point calculations
  const centerX = baseSize / 2;
  
  // Calculate SVG viewBox dimensions with proper centering
  const viewBoxWidth = baseSize * 1.5;
  const viewBoxHeight = (baseSize + peakHeight) * 1.2;
  const viewBoxX = -baseSize * 0.25;
  const viewBoxY = -peakHeight * -0.3; // Adjusted to center the peak

  const faces: PyramidFace[] = [
    // Front face
    {
      points: `${centerX},${peakHeight} 0,${baseSize + peakHeight} ${baseSize},${baseSize + peakHeight}`,
      gradientId: 'frontGradient',
      className: 'pyramid-face front'
    },
    // Left face
    {
      points: `0,${baseSize + peakHeight} ${centerX},${peakHeight} ${centerX},${baseSize + peakHeight}`,
      gradientId: 'leftGradient',
      className: 'pyramid-face left'
    },
    // Right face
    {
      points: `${baseSize},${baseSize + peakHeight} ${centerX},${peakHeight} ${centerX},${baseSize + peakHeight}`,
      gradientId: 'rightGradient',
      className: 'pyramid-face right'
    }
  ];

  return (
    <div className="isometric-pyramid">
      <svg 
        viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
        className={`w-full h-full ${className}`}
        style={style}
      >
        <defs>
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
            <feGaussianBlur stdDeviation="0.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {faces.map((face, index) => (
          <polygon
            key={index}
            points={face.points}
            fill={`url(#${face.gradientId})`}
            className={face.className}
          />
        ))}
      </svg>
    </div>
  );
};

export default IsometricPyramid; 