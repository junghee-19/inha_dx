import { BUILDING_NAMES } from '../constants';
import type { BuildingName } from '../types';
import { BUILDING_FEED_ENDPOINT } from '../config';

export interface BuildingFeedResponse {
  buildingId?: number;
  buildingName?: string;
  touchedAt?: string;
  [key: string]: unknown;
}

export interface BuildingFeedResult {
  buildingName: BuildingName | null;
  touchedAt?: string;
  raw: BuildingFeedResponse;
}

const isBuildingName = (value: unknown): value is BuildingName =>
  typeof value === 'string' &&
  BUILDING_NAMES.includes(value as BuildingName);

const getBuildingById = (id?: number): BuildingName | null => {
  if (typeof id !== 'number') return null;
  const index = id - 1;
  return BUILDING_NAMES[index] ?? null;
};

export const fetchCurrentBuilding = async (
  signal?: AbortSignal,
): Promise<BuildingFeedResult> => {
  const response = await fetch(BUILDING_FEED_ENDPOINT, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Failed to fetch building feed (${response.status}): ${text}`,
    );
  }

  const data = (await response.json()) as BuildingFeedResponse;

  const buildingName =
    (isBuildingName(data.buildingName) && data.buildingName) ||
    getBuildingById(data.buildingId) ||
    null;

  return {
    buildingName,
    touchedAt: data.touchedAt,
    raw: data,
  };
};
