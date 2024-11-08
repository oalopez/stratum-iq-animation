import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ANIMATION_CONFIG } from '../config/animation.config';

export const useAnimations = (
  containerRef: React.RefObject<HTMLDivElement>,
  machineRef: React.RefObject<HTMLDivElement>
) => {
  const timeline = useRef<gsap.core.Timeline>();

  const createParticle = useCallback((source: Element, index: number) => {
    // Particle creation logic...
  }, []);

  const initializeAnimations = useCallback(() => {
    if (!containerRef.current || !machineRef.current) return;

    const sources = containerRef.current.querySelectorAll('.data-source');
    sources.forEach((source, index) => {
      gsap.delayedCall(
        index * gsap.utils.random(ANIMATION_CONFIG.sources.startDelay.min, ANIMATION_CONFIG.sources.startDelay.max),
        () => createParticle(source, index)
      );
    });

    // Ring animations...
  }, [createParticle]);

  return { initializeAnimations, timeline };
}; 