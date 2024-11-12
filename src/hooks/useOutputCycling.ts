import { useState, useEffect } from 'react';

export const useOutputCycling = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const outputs = ['CSV', 'JSON', 'API', 'Database'];
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % outputs.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return currentIndex;
};