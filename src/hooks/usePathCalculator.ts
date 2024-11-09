import { useCallback } from 'react';

export const usePathCalculator = (containerRef: React.RefObject<HTMLDivElement>) => {
  const calculatePaths = useCallback(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    
    const centerX = width / 2;
    const centerY = height / 2;

    const paths = [
      createPath('topLeft', width, height, centerX, centerY),
      createPath('topRight', width, height, centerX, centerY),
      createPath('bottomLeft', width, height, centerX, centerY),
      createPath('bottomRight', width, height, centerX, centerY),
      createGeospatialPath(width, height, centerX, centerY),
      createPDFPath(width, height, centerX, centerY)
    ];

    updatePathElements(container, paths);
  }, []);

  return calculatePaths;
};

const createPath = (position: string, width: number, height: number, centerX: number, centerY: number) => {
  const angle = getAngleForPosition(position);
  const radius = 200; // Match the radius used in DataMachine.tsx
  const x = centerX + Math.cos(angle) * radius;
  const y = centerY + Math.sin(angle) * radius;
  
  return `M${x},${y} 
          C${getControlPoint(position, width, height)} 
          ${centerX},${centerY}`;
};

const getAngleForPosition = (position: string) => {
  const positions = {
    topLeft: -Math.PI / 2 - Math.PI / 3,
    topRight: -Math.PI / 2 - Math.PI / 6,
    bottomLeft: -Math.PI / 2 + Math.PI / 6,
    bottomRight: -Math.PI / 2 + Math.PI / 3,
  };
  return positions[position as keyof typeof positions];
};

const createGeospatialPath = (width: number, height: number, centerX: number, centerY: number) => {
  const startX = width * 0.5;
  const startY = height * 0.1;
  return `M${startX},${startY} C${startX},${height * 0.4} ${centerX},${centerY * 0.8} ${centerX},${centerY}`;
};

const createPDFPath = (width: number, height: number, centerX: number, centerY: number) => {
  const startX = width * 0.5;
  const startY = height * 0.9;
  return `M${startX},${startY} C${startX},${height * 0.6} ${centerX},${centerY * 1.2} ${centerX},${centerY}`;
};

const updatePathElements = (container: HTMLDivElement, paths: string[]) => {
  const pathElements = container.querySelectorAll('path');
  paths.forEach((path, index) => {
    if (pathElements[index]) {
      pathElements[index].setAttribute('d', path);
    }
  });
};

const getControlPoint = (position: string, width: number, height: number) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 150; // Slightly shorter than the start radius
  const angle = getAngleForPosition(position);
  
  const x = centerX + Math.cos(angle) * radius;
  const y = centerY + Math.sin(angle) * radius;
  
  return `${x},${y}`;
};

// Helper functions... 