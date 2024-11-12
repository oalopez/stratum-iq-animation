import React, { useEffect } from 'react';
import { OUTPUT_FORMATS } from '../config/animation.config';
import { useScalingFactor } from '../hooks/useScalingFactor';

interface OutputContainerProps {
  currentIndex: number;
  createOutputParticle: (sourceType: 'api' | 'geospatial' | 'pdf', container: HTMLElement) => void;
}

const OutputContainer: React.FC<OutputContainerProps> = ({ currentIndex, createOutputParticle }) => {
  const scalingFactor = useScalingFactor();

  useEffect(() => {
    const container = document.querySelector('.output-particles-container') as HTMLElement;
    if (!container) return;

    const createParticles = () => {
      const sources: Array<'api' | 'geospatial' | 'pdf'> = ['api', 'geospatial', 'pdf'];
      const randomSource = sources[Math.floor(Math.random() * sources.length)];
      createOutputParticle(randomSource, container);
    };

    const particleInterval = setInterval(createParticles, 250);

    return () => {
      clearInterval(particleInterval);
    };
  }, [createOutputParticle]);

  const baseIconSize = 48; // 12 * 4 (w-12 h-12 in original)
  const scaledIconSize = baseIconSize * scalingFactor;
  const containerSize = 144 * scalingFactor; // 36 * 4 (w-36 h-36 in original)

  return (
    <div 
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4"
      style={{ transform: `translate(-50%, 0) scale(${scalingFactor})` }}
    >
      <div className="relative">
        <div style={{ width: containerSize, height: containerSize }} className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1D9C9C]/10 to-[#105069]/10 
                        backdrop-blur-sm rounded-xl border border-[#1D9C9C]/20
                        shadow-[0_0_10px_rgba(29,156,156,0.15)]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-2 p-2">
                {OUTPUT_FORMATS.map((format, index) => {
                  const Icon = format.icon;
                  return (
                    <div key={format.type} 
                         className={`relative transition-all duration-500 ease-out
                                  ${index === currentIndex ? 'scale-110' : 'scale-90'}`}>
                      <div className="output-icon-container">
                        <Icon 
                          className={`output-icon ${index === currentIndex ? 'active' : ''}`}
                          style={{
                            width: scaledIconSize,
                            height: scaledIconSize,
                            transition: 'all 0.5s ease',
                            transformOrigin: 'center',
                            color: index === currentIndex ? '#1D9C9C' : '#105069'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutputContainer; 