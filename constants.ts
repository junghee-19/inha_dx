// FIX: Import the `BuildingName` type to fix reference errors caused by a circular dependency between `types.ts` and `constants.ts`.
import type { Building, DirectoryRow, FloorPlanLabel, BuildingName } from './types';
import building1Image from '@assets/1호관.jpg';
import building2Image from '@assets/2호관.jpg';
import building3Image from '@assets/3호관.jpg';
import building4Image from '@assets/4호관.jpg';
import building5Image from '@assets/5호관.jpg';
import building6Image from '@assets/6호관.jpg';
import building7Image from '@assets/7호관.jpg';
import building8Image from '@assets/8호관.jpg';
import building9Image from '@assets/9호관.jpg';
import building10Image from '@assets/10호관.jpg';
import building11Image from '@assets/11호관.jpg';

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
    '1호관': building1Image,
    '2호관': building2Image,
    '3호관': building3Image,
    '4호관': building4Image,
    '5호관': building5Image,
    '6호관': building6Image,
    '7호관': building7Image,
    '8호관': building8Image,
    '9호관': building9Image,
    '10호관': building10Image,
    '11호관': building11Image,
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
