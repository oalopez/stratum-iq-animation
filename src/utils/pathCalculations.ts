import { DATA_SOURCES } from '../config/animation.config';

export const calculateDataPaths = (width: number, height: number, radius: number) => {
  const centerX = width / 2;
  const centerY = height / 2;

  return DATA_SOURCES.map((_, index) => {
    const totalAngle = 2 * Math.PI - (120 * Math.PI / 180);
    const angleOffset = -Math.PI / 2;
    const startAngle = angleOffset - (totalAngle / 2);
    const angle = startAngle + (index * (totalAngle / DATA_SOURCES.length));
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    return `M${x},${y} 
            C${x * 0.8 + centerX * 0.2},${y * 0.8 + centerY * 0.2} 
            ${x * 0.2 + centerX * 0.8},${y * 0.2 + centerY * 0.8} 
            ${centerX},${centerY}`;
  });
};

export const calculateTubePath = (width: number, height: number, scalingFactor: number) => {
  const startX = width / 2;
  const pyramidHeight = 160 * scalingFactor; // Adjust this value based on your pyramid size
  const startY = height / 2 + (pyramidHeight / 2); // Start from the bottom of the pyramid
  const endY = height - (180 * scalingFactor); // End at the top of the output container
  const controlPoint1Y = startY + (endY - startY) / 3;
  const controlPoint2Y = endY - (endY - startY) / 3;
  
  return `
    M ${startX},${startY}
    C ${startX},${controlPoint1Y}
      ${startX - (40 * scalingFactor)},${controlPoint2Y}
      ${startX},${endY}
  `;
}; 