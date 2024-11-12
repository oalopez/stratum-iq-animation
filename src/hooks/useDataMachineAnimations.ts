import { useEffect, useCallback } from 'react';
import { useParticleSystem } from './useParticleSystem';

export const useDataMachineAnimations = (containerRef: React.RefObject<HTMLDivElement>) => {
  const { createParticle, createOutputParticle } = useParticleSystem();

  const initializeParticles = useCallback(() => {
    if (!containerRef.current) return;

    const sources = containerRef.current.querySelectorAll('.data-source');
    sources.forEach((source, index) => {
      const startDelay = index * Math.random() * 2;
      setTimeout(() => {
        createParticle(source, index);
      }, startDelay * 1000);
    });
  }, [createParticle]);

  useEffect(() => {
    initializeParticles();
    const interval = setInterval(initializeParticles, 5000);
    return () => clearInterval(interval);
  }, [initializeParticles]);

  return { createOutputParticle };
};