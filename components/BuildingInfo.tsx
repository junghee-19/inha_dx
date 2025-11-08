import React, { useMemo, useState, useEffect } from 'react';
import type { Building, Room } from '../types';

interface BuildingInfoProps {
  building: Building;
}

const BuildingInfo: React.FC<BuildingInfoProps> = ({ building }) => {
  const directoryByLevel = useMemo(() => {
    const grouped: Record<string, Room[]> = {};
    for (const row of building.directory) {
      if (!grouped[row.level]) {
        grouped[row.level] = [];
      }
      grouped[row.level].push(...row.columns.flat());
    }
    // Sort floors logically (e.g., B1F, 1F, 2F)
    return Object.entries(grouped).sort(([levelA], [levelB]) => {
      const isBasementA = levelA.toUpperCase().startsWith('B');
      const isBasementB = levelB.toUpperCase().startsWith('B');
      const numA = parseInt(levelA);
      const numB = parseInt(levelB);

      if (isBasementA && !isBasementB) return -1;
      if (!isBasementA && isBasementB) return 1;

      return numA - numB;
    });
  }, [building.directory]);

  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedFloorPlanLevel, setSelectedFloorPlanLevel] = useState<string>('');

  useEffect(() => {
    if (directoryByLevel.length > 0) {
      setSelectedLevel(directoryByLevel[0][0]);
    } else {
      setSelectedLevel('');
    }
  }, [building.id, directoryByLevel]);

  useEffect(() => {
    if (building.floorPlanLabels.length > 0) {
      setSelectedFloorPlanLevel(building.floorPlanLabels[0].level);
    } else {
      setSelectedFloorPlanLevel('');
    }
  }, [building.id, building.floorPlanLabels]);


  const selectedRooms = useMemo(() => {
    return directoryByLevel.find(([level]) => level === selectedLevel)?.[1] || [];
  }, [directoryByLevel, selectedLevel]);

  const currentFloorPlanImage = useMemo(() => {
    return building.floorPlanLabels.find(label => label.level === selectedFloorPlanLevel)?.image || '';
  }, [building.floorPlanLabels, selectedFloorPlanLevel]);


  return (
    <section className="w-full max-w-6xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{building.name}</h2>
      <div className="flex flex-row gap-12 items-start">
        {/* Left Column: Building Image */}
        <div className="w-7/12 flex-shrink-0">
          <img
            src={building.image}
            alt={`${building.name} exterior`}
            className="w-full h-auto object-cover rounded-lg shadow-md aspect-[4/3]"
            loading="lazy"
          />
        </div>

        {/* Right Column: Title, Floor Plan & Directory */}
        <div className="w-5/12 flex flex-col gap-8 flex-shrink-0">
          {/* Floor Plan */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col justify-between self-stretch py-2 text-sm font-medium text-right flex-shrink-0">
                {building.floorPlanLabels.map(label => (
                    <button
                        key={label.level}
                        onClick={() => setSelectedFloorPlanLevel(label.level)}
                        type="button"
                        aria-label={`View floor plan for ${label.level}`}
                        className={`px-1 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 ${
                            selectedFloorPlanLevel === label.level
                            ? 'text-blue-600 font-bold'
                            : 'text-gray-500 hover:text-gray-800'
                        }`}
                    >
                        {label.level}
                    </button>
                ))}
            </div>
            <div className="flex-grow min-w-0">
                 {currentFloorPlanImage ? (
                    <img
                        src={currentFloorPlanImage}
                        alt={`${building.name} ${selectedFloorPlanLevel} floor plan`}
                        className="w-full h-auto object-contain rounded-md"
                        loading="lazy"
                    />
                 ) : (
                    <div className="w-full aspect-[4/3] bg-gray-100 rounded-md flex items-center justify-center">
                        <p className="text-gray-400 text-sm">No floor plan available.</p>
                    </div>
                 )}
            </div>
          </div>

          {/* Directory Tabs */}
          <div>
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    {directoryByLevel.map(([level]) => (
                        <button
                            key={level}
                            onClick={() => setSelectedLevel(level)}
                            type="button"
                            aria-label={`View directory for ${level}`}
                            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded-t-sm transition-colors duration-200 ${
                                selectedLevel === level
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {level}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="py-4 min-h-[100px]">
                {selectedRooms.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-gray-700 text-sm animate-fade-in">
                        {selectedRooms.map((room, index) => (
                            <div key={index}>{room.name}</div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm pt-2">Select a floor to see the directory.</p>
                )}
            </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default BuildingInfo;