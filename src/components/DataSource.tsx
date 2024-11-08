import React from 'react';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface DataSourceProps {
  type: string;
  color: string;
  label: string;
  icon: keyof typeof Icons;
  position: React.CSSProperties;
}

export const DataSource: React.FC<DataSourceProps> = ({ type, color, label, icon, position }) => {
  const Icon = Icons[icon] as LucideIcon;
  
  return (
    <div className="data-source absolute flex flex-col items-center gap-2" style={position}>
      <Icon className={`w-12 h-12 text-${color} relative z-20`} />
      <span className={`text-${color} text-sm font-medium`}>{label}</span>
      <div className={`particle absolute w-4 h-4 bg-${color} rounded-full scale-0 opacity-0 z-5`} />
    </div>
  );
}; 