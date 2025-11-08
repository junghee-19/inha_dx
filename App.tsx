import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import BuildingInfo from './components/BuildingInfo';
import { BUILDING_DATA, BUILDING_NAMES } from './constants';
import type { BuildingName } from './types';
import { SparkleIcon } from './components/Icons';

const App: React.FC = () => {
  const [activeBuilding, setActiveBuilding] = useState<BuildingName>(BUILDING_NAMES[0]);

  const selectedBuildingData = useMemo(() => {
    return BUILDING_DATA.find(building => building.name === activeBuilding);
  }, [activeBuilding]);

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8 relative">
        <Header />
        <Navigation
          activeBuilding={activeBuilding}
          setActiveBuilding={setActiveBuilding}
        />
        <main className="mt-8">
          {selectedBuildingData ? (
            <BuildingInfo building={selectedBuildingData} />
          ) : (
            <div className="text-center text-gray-500">
              <p>Please select a building to see its details.</p>
            </div>
          )}
        </main>
      </div>
       <footer className="fixed bottom-0 right-0 p-8 z-10 pointer-events-none">
         <SparkleIcon className="w-16 h-16 text-gray-800" />
      </footer>
    </div>
  );
};

export default App;