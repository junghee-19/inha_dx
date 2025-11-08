// FIX: Import the `BuildingName` type to fix reference errors caused by a circular dependency between `types.ts` and `constants.ts`.
import type { Building, DirectoryRow, FloorPlanLabel, BuildingName } from './types';

export const BUILDING_NAMES = ['1호관', '2호관', '3호관', '4호관', '5호관', '6호관', '7호관', '8호관', '9호관', '10호관', '11호관'] as const;

// Helper to generate placeholder floor plan labels in descending order for the UI
const generateFloorPlanLabels = (levels: string[]): FloorPlanLabel[] => {
    const images = [
        'https://i.imgur.com/sC3a3gC.png',
        'https://i.imgur.com/V7XJ4er.png',
        'https://i.imgur.com/8z2Q5M4.png',
        'https://i.imgur.com/gO0A3v1.png',
    ];
    return [...levels].reverse().map((level, index) => ({
        level,
        image: images[index % images.length],
    }));
};

// Helper to generate placeholder directory rows in ascending order
const generateDirectory = (levels: string[]): DirectoryRow[] => {
    return levels.map(level => ({
        level,
        columns: [[{ name: `${level} 주요 시설` }], [{ name: `${level} 기타 시설` }]],
    }));
};

// Defines the floor structure for each building
const buildingFloors: Record<string, string[]> = {
    '1호관': ['1F', '2F', '3F', '4F', '5F', '옥상'],
    '2호관': ['B1F', '1F', '2F', '3F', '4F', '5F', '옥상'],
    '3호관': ['B1F', '1F', '2F', '3F', '4F', '5F', '옥상'],
    '4호관': ['B1F', '1F', '2F', '3F', '4F', '5F', '6F', '옥상'],
    '5호관': ['B1F', '1F', '2F', '3F', '4F', '옥상'],
    '6호관': ['1F', '2F', '3F', '옥상'],
    '7호관': ['1F', '2F', '3F', '4F', '5F', '옥상'],
    '8호관': ['1F', '2F', '3F'], // Default as per original template
    '9호관': ['1F', '2F', '3F'], // Default as per original template
    '10호관': ['1F', '2F', '3F', '4F', '옥상'],
    '11호관': ['B2F', 'B1F', '1F', '2F', '3F', '4F', '5F', '옥상'],
};

// Defines the main image for each building
const buildingImages: Record<string, string> = {
    '1호관': 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop',
    '2호관': 'https://images.unsplash.com/photo-1582215894002-a035272267b5?q=80&w=1200&auto=format&fit=crop',
    '3호관': 'https://images.unsplash.com/photo-1607237138185-e894ee31b2af?q=80&w=1200&auto=format&fit=crop',
    '4호관': 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=1200&auto=format&fit=crop',
    '5호관': 'https://images.unsplash.com/photo-1554462123-99333b28b49e?q=80&w=1200&auto=format&fit=crop',
    '6호관': 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?q=80&w=1200&auto=format&fit=crop',
    '7호관': 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop',
    '8호관': 'https://images.unsplash.com/photo-1600106963243-52417741d48c?q=80&w=1200&auto=format&fit=crop',
    '9호관': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop',
    '10호관': 'https://images.unsplash.com/photo-1621293954908-564195a62d94?q=80&w=1200&auto=format&fit=crop',
    '11호관': 'https://images.unsplash.com/photo-1567423696129-a1d4b2a47d0e?q=80&w=1200&auto=format&fit=crop',
};

// Generate the final data for all buildings
export const BUILDING_DATA: Building[] = BUILDING_NAMES.map((name, index) => {
    const floors = buildingFloors[name as BuildingName] || [];
    return {
        id: index + 1,
        name: name as BuildingName,
        image: buildingImages[name as BuildingName],
        floorPlanLabels: generateFloorPlanLabels(floors),
        directory: generateDirectory(floors),
    };
});