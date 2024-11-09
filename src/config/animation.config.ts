import { Table2, FileJson, FileCode, Database } from 'lucide-react';

export const ANIMATION_CONFIG = {
  particles: {
    // Controls the initial size of particles when they spawn
    // min: Smallest possible starting scale (1.2x normal size)
    // max: Largest possible starting scale (1.6x normal size)
    scale: {
      min: 0.2, // x larger than normal
      max: 0.5  // x larger than normal 
    },
    // Controls the opacity of particles when they spawn
    // min: Minimum opacity value (60% visible)
    // max: Maximum opacity value (80% visible)
    opacity: {
      min: 0.8, // Increase from 0.6
      max: 1.0  // Increase from 0.8
    },
    // Controls how long particles take to travel their paths
    // min: Shortest possible duration (4 seconds)
    // max: Longest possible duration (5 seconds) 
    duration: {
      min: 2,
      max: 5
    },
    // Controls the final scale of particles before they disappear
    // Value of 1 means particles shrink back to their original size
    endScale: 1,
    // How often particles are created (in seconds)
    frequency: {
      min: 2, // Minimum time between particle creation
      max: 4  // Maximum time between particle creation
    }
  },
  sources: {
    // Controls the initial delay before particles start spawning from each source
    // min: Minimum delay of 2 seconds before first particle
    // max: Maximum delay of 3 seconds before first particle
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

export const PARTICLE_LIMITS = {
  sources: {
    // Maximum number of particles that can be active at once for each individual source
    maxPerSource: 2,
    // Maximum total particles across all sources (6 sources × 3 particles each = 18)
    total: 12
  },
  output: {
    // Maximum number of output particles that can be active at once
    max: 8
  }
};

export const DATA_SOURCES = [
  { type: 'json', color: 'text-blue-400', label: 'JSON Data', icon: 'FileJson' },
  { type: 'spreadsheet', color: 'text-green-400', label: 'Spreadsheet', icon: 'FileSpreadsheet' },
  { type: 'image', color: 'text-purple-400', label: 'Image Data', icon: 'FileImage' },
  { type: 'html', color: 'text-yellow-400', label: 'HTML', icon: 'FileCode' },
  { type: 'geospatial', color: 'text-cyan-400', label: 'Geospatial', icon: 'Globe2' },
  { type: 'pdf', color: 'text-rose-400', label: 'PDF Files', icon: 'FileText' }
];

export const OUTPUT_FORMATS = [
  { type: 'csv', icon: Table2, label: 'CSV' },
  { type: 'json', icon: FileJson, label: 'JSON' },
  { type: 'api', icon: FileCode, label: 'API' },
  { type: 'database', icon: Database, label: 'Database' }
]; 