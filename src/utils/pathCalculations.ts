import { DATA_SOURCES } from '../config/animation.config';

export const calculateDataPaths = (width: number, height: number) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 200;

  return DATA_SOURCES.map((_, index) => {
    const angle = (index * (2 * Math.PI / DATA_SOURCES.length)) - (Math.PI / 2);
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    return `M${x},${y} 
            C${x * 0.8 + centerX * 0.2},${y * 0.8 + centerY * 0.2} 
            ${x * 0.2 + centerX * 0.8},${y * 0.2 + centerY * 0.8} 
            ${centerX},${centerY}`;
  });
};

export const calculateTubePath = (width: number, height: number) => {
  const startX = width / 2;
  const startY = height / 2;
  const endY = height - 180;
  
  return `
    M ${startX},${startY}
    C ${startX},${startY + 50}
      ${startX - 20},${endY - 50}
      ${startX},${endY}
  `;
}; 