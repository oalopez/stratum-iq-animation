import React from 'react';
import * as Icons from 'lucide-react';
import { DATA_SOURCES } from '../config/animation.config';
import { useScalingFactor } from '../hooks/useScalingFactor';

const DataSources: React.FC = () => {
  const scalingFactor = useScalingFactor();
  const radius = 260 * scalingFactor;

  return (
    <>
      {DATA_SOURCES.map((source, index) => {
        const totalAngle = 2 * Math.PI - (120 * Math.PI / 180);
        const angleOffset = -Math.PI / 2;
        const startAngle = angleOffset - (totalAngle / 2);
        const angle = startAngle + (index * (totalAngle / DATA_SOURCES.length));
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius + (40 * scalingFactor);

        return (
          <div 
            key={source.type}
            className="data-source absolute flex flex-col items-center gap-2"
            style={{ 
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scalingFactor})`
            }}
          >
            {React.createElement(Icons[source.icon as keyof typeof Icons] as React.ComponentType<any>, {
              className: `w-12 h-12 ${source.color} relative z-20`
            })}
            <span className={`${source.color} text-sm font-medium`}>
              {source.label}
            </span>
            <div 
              className={`particle absolute w-4 h-4 rounded-full scale-0 z-5`}
              style={{
                backgroundColor: source.color.includes('blue') ? '#2563eb' : 
                                source.color.includes('green') ? '#16a34a' :
                                source.color.includes('purple') ? '#9333ea' :
                                source.color.includes('yellow') ? '#ca8a04' :
                                source.color.includes('cyan') ? '#0891b2' :
                                source.color.includes('rose') ? '#e11d48' : '#1D9C9C',
                opacity: 0,
                filter: 'blur(4px)',
                boxShadow: '0 0 15px currentColor'
              }}
            />
          </div>
        );
      })}
    </>
  );
};

export default DataSources; 