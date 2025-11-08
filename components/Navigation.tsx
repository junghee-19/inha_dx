import React from 'react';
import { BUILDING_NAMES } from '../constants';
import type { BuildingName } from '../types';

interface NavigationProps {
  activeBuilding: BuildingName;
  setActiveBuilding: (name: BuildingName) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeBuilding, setActiveBuilding }) => {
  return (
    <nav className="flex justify-center pb-4">
      <div className="max-w-full flex items-center overflow-x-auto whitespace-nowrap py-2 scrollbar-hide">
        {BUILDING_NAMES.map((name, index) => (
          <React.Fragment key={name}>
            <button
              onClick={() => setActiveBuilding(name)}
              className={`px-4 py-2 text-lg font-medium transition-colors duration-200 border-b-2 focus:outline-none shrink-0
              ${
                activeBuilding === name
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {name}
            </button>
            {index < BUILDING_NAMES.length - 1 && (
              <div className="h-5 self-center border-r border-gray-300"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;