interface PathStarts {
  topLeft: { x: number; y: number };
  topRight: { x: number; y: number };
  bottomLeft: { x: number; y: number };
  bottomRight: { x: number; y: number };
}

export const calculateDataPaths = (width: number, height: number) => {
  const pathStarts: PathStarts = {
    topLeft: { x: width * 0.20, y: height * 0.20 },
    topRight: { x: width * 0.80, y: height * 0.20 },
    bottomLeft: { x: width * 0.20, y: height * 0.80 },
    bottomRight: { x: width * 0.80, y: height * 0.80 },
  };

  const centerX = width / 2;
  const centerY = height / 2;

  return [
    // Top left - S-curve
    `M${pathStarts.topLeft.x},${pathStarts.topLeft.y} 
     C${width * 0.25},${height * 0.35} 
     ${width * 0.35},${height * 0.25} 
     ${centerX},${centerY}`,
    
    // Top right - wide arc
    `M${pathStarts.topRight.x},${pathStarts.topRight.y} 
     C${width * 0.75},${height * 0.35} 
     ${width * 0.65},${height * 0.25} 
     ${centerX},${centerY}`,
    
    // Bottom left - tight curve
    `M${pathStarts.bottomLeft.x},${pathStarts.bottomLeft.y} 
     C${width * 0.25},${height * 0.65} 
     ${width * 0.35},${height * 0.75} 
     ${centerX},${centerY}`,
    
    // Bottom right - wavy path
    `M${pathStarts.bottomRight.x},${pathStarts.bottomRight.y} 
     C${width * 0.75},${height * 0.65} 
     ${width * 0.65},${height * 0.75} 
     ${centerX},${centerY}`,
    
    // Geospatial data path
    `M${width * 0.80},${height * 0.5} 
     C${width * 0.70},${height * 0.5} 
     ${width * 0.65},${height * 0.5} 
     ${centerX},${centerY}`,
    
    // PDF data path
    `M${width * 0.5},${height * 0.20} 
     C${width * 0.5},${height * 0.30} 
     ${width * 0.5},${height * 0.35} 
     ${centerX},${centerY}`
  ];
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