import { Table2, FileJson, FileCode, Database } from 'lucide-react';

export const ANIMATION_CONFIG = {
  particles: {
    scale: {
      min: 1.2,
      max: 1.6
    },
    opacity: {
      min: 0.6,
      max: 0.8
    },
    duration: {
      min: 3,
      max: 4
    },
    endScale: 0.6,
    frequency: {
      min: 1,
      max: 2
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
};

export const DATA_SOURCES = [
  { type: 'json', color: 'blue-400', label: 'JSON Data', icon: 'FileJson' },
  { type: 'spreadsheet', color: 'green-400', label: 'Spreadsheet', icon: 'FileSpreadsheet' },
  { type: 'image', color: 'purple-400', label: 'Image Data', icon: 'FileImage' },
  { type: 'html', color: 'yellow-400', label: 'HTML', icon: 'FileCode' },
  { type: 'geospatial', color: 'cyan-400', label: 'Geospatial', icon: 'Globe2' },
  { type: 'pdf', color: 'rose-400', label: 'PDF Files', icon: 'FileText' }
];

export const OUTPUT_FORMATS = [
  { type: 'csv', icon: Table2, label: 'CSV' },
  { type: 'json', icon: FileJson, label: 'JSON' },
  { type: 'api', icon: FileCode, label: 'API' },
  { type: 'database', icon: Database, label: 'Database' }
]; 