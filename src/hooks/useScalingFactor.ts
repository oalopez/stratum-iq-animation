import { useState, useEffect } from 'react';

export const useScalingFactor = () => {
  const [scalingFactor, setScalingFactor] = useState(1);

  useEffect(() => {
    const calculateScaling = () => {
      const baseWidth = 1920; // Base design width
      const baseHeight = 1080; // Base design height
      
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Calculate scaling based on both dimensions
      const widthScale = windowWidth / baseWidth;
      const heightScale = windowHeight / baseHeight;
      
      // Use the smaller scaling factor to maintain proportions
      const scale = Math.min(widthScale, heightScale);
      
      setScalingFactor(scale);
    };

    calculateScaling();
    window.addEventListener('resize', calculateScaling);
    
    return () => window.removeEventListener('resize', calculateScaling);
  }, []);

  return scalingFactor;
}; 