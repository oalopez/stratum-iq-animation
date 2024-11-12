import { Table2, FileJson, FileCode, Database } from 'lucide-react';

export const getAnimationConfig = (scalingFactor: number) => ({
  particles: {
    scale: {
      min: 0.2 * scalingFactor,
      max: 0.5 * scalingFactor
    },
    opacity: {
      min: 0.8,
      max: 1.0
    },
    duration: {
      min: 2,
      max: 5
    },
    endScale: 1,
    frequency: {
      min: 2,
      max: 4
    }
  },
  sources: {
    startDelay: {
      min: 1,
      max: 2
    }
  },
  paths: {
    padding: 0.1,
    strokeWidth: 0,
    opacity: 0.4
  }
});

export const PARTICLE_LIMITS = {
  sources: {
    maxPerSource: 2,
    total: 12
  },
  output: {
    max: 8
  }
};

export const DATA_SOURCES = [
  { type: 'json', color: 'text-blue-600', label: 'JSON Data', icon: 'FileJson' },
  { type: 'spreadsheet', color: 'text-green-600', label: 'Spreadsheet', icon: 'FileSpreadsheet' },
  { type: 'image', color: 'text-purple-600', label: 'Image Data', icon: 'FileImage' },
  { type: 'html', color: 'text-yellow-600', label: 'HTML', icon: 'FileCode' },
  { type: 'geospatial', color: 'text-cyan-600', label: 'Geospatial', icon: 'Globe2' },
  { type: 'pdf', color: 'text-rose-600', label: 'PDF Files', icon: 'FileText' }
];

export const OUTPUT_FORMATS = [
  { type: 'csv', icon: Table2, label: 'CSV' },
  { type: 'json', icon: FileJson, label: 'JSON' },
  { type: 'api', icon: FileCode, label: 'API' },
  { type: 'database', icon: Database, label: 'Database' }
]; 