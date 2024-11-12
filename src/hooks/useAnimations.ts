import { useRef, useCallback } from 'react';
import gsap from 'gsap';
import { getAnimationConfig } from '../config/animation.config';
import { useScalingFactor } from './useScalingFactor';

export const useAnimations = (
  containerRef: React.RefObject<HTMLDivElement>,
  machineRef: React.RefObject<HTMLDivElement>
) => {
  const timeline = useRef<gsap.core.Timeline>();

  const createParticle = useCallback((_source: Element, _index: number) => {
    // Particle creation logic...
  }, []);

  const initializeAnimations = useCallback(() => {
    if (!containerRef.current || !machineRef.current) return;

    const scalingFactor = useScalingFactor();
    const config = getAnimationConfig(scalingFactor);
    const sources = containerRef.current.querySelectorAll('.data-source');
    sources.forEach((source, index) => {
      gsap.delayedCall(
        index * gsap.utils.random(config.sources.startDelay.min, config.sources.startDelay.max),
        () => createParticle(source, index)
      );
    });

    // Ring animations...
  }, [createParticle]);

  return { initializeAnimations, timeline };
}; 