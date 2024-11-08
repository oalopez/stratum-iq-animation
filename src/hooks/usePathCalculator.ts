import { useCallback } from 'react';

export const usePathCalculator = (containerRef: React.RefObject<HTMLDivElement>) => {
  const calculatePaths = useCallback(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    
    const pathStarts = {
      topLeft: { x: width * 0.20, y: height * 0.20 },
      topRight: { x: width * 0.80, y: height * 0.20 },
      bottomLeft: { x: width * 0.20, y: height * 0.80 },
      bottomRight: { x: width * 0.80, y: height * 0.80 }
    };

    const centerX = width / 2;
    const centerY = height / 2;

    const paths = [
      createPath('topLeft', pathStarts, width, height, centerX, centerY),
      createPath('topRight', pathStarts, width, height, centerX, centerY),
      createPath('bottomLeft', pathStarts, width, height, centerX, centerY),
      createPath('bottomRight', pathStarts, width, height, centerX, centerY),
      createGeospatialPath(width, height, centerX, centerY),
      createPDFPath(width, height, centerX, centerY)
    ];

    updatePathElements(container, paths);
  }, []);

  return calculatePaths;
};

const createPath = (position: string, starts: any, width: number, height: number, centerX: number, centerY: number) => {
  const start = starts[position];
  return `M${start.x},${start.y} 
          C${getControlPoint(position, width, height)} 
          ${centerX},${centerY}`;
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
  const controls = {
    topLeft: `${width * 0.2},${height * 0.4}`,
    topRight: `${width * 0.8},${height * 0.4}`,
    bottomLeft: `${width * 0.2},${height * 0.6}`,
    bottomRight: `${width * 0.8},${height * 0.6}`
  };
  return controls[position as keyof typeof controls];
};

// Helper functions... 