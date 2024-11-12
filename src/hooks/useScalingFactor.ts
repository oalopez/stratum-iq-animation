import { useState, useEffect } from 'react';

export const useScalingFactor = () => {
  const [scalingFactor, setScalingFactor] = useState(1);

  useEffect(() => {
    const calculateScaling = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Calculate scaling based on the larger dimension to fill the screen
      const widthScale = windowWidth / 1000; // Reduced base width for better scaling
      const heightScale = windowHeight / 800; // Reduced base height for better scaling
      
      // Use the larger scaling factor to ensure full screen coverage
      const scale = Math.max(widthScale, heightScale);
      
      setScalingFactor(scale);
    };

    calculateScaling();
    window.addEventListener('resize', calculateScaling);
    
    return () => window.removeEventListener('resize', calculateScaling);
  }, []);

  return scalingFactor;
}; 