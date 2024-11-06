import React from 'react';
import DataMachine from './components/DataMachine';

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <header className="absolute top-0 left-0 right-0 z-10 p-8">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          StratumIQ
        </h1>
        <p className="text-center text-indigo-200 mt-2">
          Transforming data into decisions
        </p>
      </header>
      <DataMachine />
    </div>
  );
}

export default App;