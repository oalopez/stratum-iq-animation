import { useCallback, useRef } from 'react';
import gsap from 'gsap';
import { ANIMATION_CONFIG, PARTICLE_LIMITS } from '../config/animation.config';

interface ParticleTracking {
  sources: Map<number, HTMLElement[]>;
  output: Set<HTMLElement>;
}

export const useParticleSystem = () => {
  const particleTrackingRef = useRef<ParticleTracking>({
    sources: new Map<number, HTMLElement[]>(),
    output: new Set<HTMLElement>()
  });

  const createParticle = useCallback((source: Element, index: number) => {
    const particle = source.querySelector('.particle');
    if (!particle) return;

    const existingParticles = particleTrackingRef.current.sources.get(index) || [];
    if (existingParticles.length >= PARTICLE_LIMITS.sources.maxPerSource) {
      gsap.delayedCall(
        gsap.utils.random(ANIMATION_CONFIG.particles.frequency.min, ANIMATION_CONFIG.particles.frequency.max),
        () => createParticle(source, index)
      );
      return;
    }

    const clonedParticle = particle.cloneNode(true) as HTMLElement;
    source.appendChild(clonedParticle);
    
    particleTrackingRef.current.sources.set(index, [...existingParticles, clonedParticle]);
    
    const randomDuration = gsap.utils.random(ANIMATION_CONFIG.particles.duration.min, ANIMATION_CONFIG.particles.duration.max);
    const randomScale = gsap.utils.random(ANIMATION_CONFIG.particles.scale.min, ANIMATION_CONFIG.particles.scale.max);
    const randomOpacity = gsap.utils.random(ANIMATION_CONFIG.particles.opacity.min, ANIMATION_CONFIG.particles.opacity.max);
    
    gsap.fromTo(clonedParticle,
      { scale: randomScale, opacity: randomOpacity },
      {
        scale: ANIMATION_CONFIG.particles.endScale,
        opacity: 0,
        motionPath: {
          path: `#path-${index}`,
          align: `#path-${index}`,
          autoRotate: true,
          alignOrigin: [0.5, 0.5]
        },
        duration: randomDuration,
        ease: "none",
        onComplete: () => {
          const particles = particleTrackingRef.current.sources.get(index) || [];
          particleTrackingRef.current.sources.set(
            index,
            particles.filter(p => p !== clonedParticle)
          );
          clonedParticle.remove();
        }
      }
    );

    gsap.delayedCall(
      gsap.utils.random(ANIMATION_CONFIG.particles.frequency.min, ANIMATION_CONFIG.particles.frequency.max),
      () => createParticle(source, index)
    );
  }, []);

  const createOutputParticle = useCallback((sourceType: 'api' | 'geospatial' | 'pdf', container: HTMLElement) => {
    if (particleTrackingRef.current.output.size >= PARTICLE_LIMITS.output.max) {
      return;
    }

    const particle = document.createElement('div');
    particle.className = `output-particle ${sourceType}`;
    
    const pathElement = document.querySelector('#tube-path') as SVGPathElement;
    if (!pathElement) return;
    
    const startPoint = pathElement.getPointAtLength(0);
    particle.style.transform = `translate(${startPoint.x}px, ${startPoint.y}px)`;
    
    container.appendChild(particle);
    particleTrackingRef.current.output.add(particle);
    
    gsap.to(particle, {
      motionPath: {
        path: '#tube-path',
        align: '#tube-path',
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
      },
      duration: 1.5 + Math.random() * 0.4,
      ease: "power2.out",
      onComplete: () => {
        particleTrackingRef.current.output.delete(particle);
        particle.remove();
      }
    });
  }, []);

  const clearParticles = useCallback((container: HTMLElement) => {
    particleTrackingRef.current.sources.clear();
    particleTrackingRef.current.output.clear();
    container.querySelectorAll('.particle').forEach(p => p.remove());
    container.querySelectorAll('.output-particle').forEach(p => p.remove());
  }, []);

  return {
    createParticle,
    createOutputParticle,
    clearParticles
  };
}; 