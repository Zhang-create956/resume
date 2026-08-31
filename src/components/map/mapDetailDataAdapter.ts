// SPDX-License-Identifier: GPL-3.0-or-later
// 作者全平台ID：宋夏天Dazzle；公众号：送你整个夏天
// Source map component: https://github.com/songsummer920-dazzle/three-scope-map-skill

import type { GeoFeature, GeoFeatureCollection, Position } from '../../types/geo';

// Detail data is queried only after a street is selected. This keeps the city
// map fast while still using real OpenStreetMap roads and building footprints.
// Data © OpenStreetMap contributors, available under the ODbL.
// https://www.openstreetmap.org/copyright

export type DetailRoad = {
  id: string;
  kind: string;
  coordinates: Position[];
};

export type DetailBuilding = {
  id: string;
  heightMeters: number;
  coordinates: Position[];
};

export type StreetDetailData = {
  streetGeoData: GeoFeatureCollection;
  roads: DetailRoad[];
  buildings: DetailBuilding[];
  source: 'OpenStreetMap';
  sourceUrl: string;
};

type OsmWay = {
  type: 'way';
  id: number;
  tags?: Record<string, string>;
  geometry?: Array<{ lat: number; lon: number }>;
};

type OsmResponse = {
  elements?: OsmWay[];
};

type Bounds = { west: number; south: number; east: number; north: number };

const localStreetModules = import.meta.glob('../../assets/maps/streets/*.json', {
  eager: true,
  import: 'default',
});
const streetFeatureByCode = new Map<string, GeoFeature>();
Object.values(localStreetModules).forEach((value) => {
  const collection = value as GeoFeatureCollection;
  collection.features.forEach((feature) => {
    const code = String(feature.properties.adcode ?? '');
    if (code) streetFeatureByCode.set(code, feature);
  });
});

type LocalDetailCache = {
  streetCode: string;
  source?: string;
  sourceUrl?: string;
  roads?: OsmWay[];
  buildings?: OsmWay[];
};

// A small checked-in OSM cache gives the dashboard an immediately verifiable
// road/building detail view when a public Overpass mirror is momentarily busy.
// Other Shenzhen streets continue to use the same real-data query on demand.
const localDetailModules = import.meta.glob('../../assets/maps/details/*.json', {
  eager: true,
  import: 'default',
});
const localDetailCacheByCode = new Map<string, LocalDetailCache>();
Object.values(localDetailModules).forEach((value) => {
  const detail = value as LocalDetailCache;
  if (detail.streetCode) localDetailCacheByCode.set(detail.streetCode, detail);
});

const detailCache = new Map<string, StreetDetailData>();
const pendingDetails = new Map<string, Promise<StreetDetailData>>();

function collectCoordinates(feature: GeoFeature) {
  const polygons = feature.geometry.type === 'Polygon'
    ? [feature.geometry.coordinates as Position[][]]
    : feature.geometry.coordinates as Position[][][];
  return polygons.flatMap((polygon) => polygon.flat());
}

function getBounds(feature: GeoFeature): Bounds {
  const coordinates = collectCoordinates(feature);
  const longitudes = coordinates.map(([longitude]) => longitude);
  const latitudes = coordinates.map(([, latitude]) => latitude);
  return {
    west: Math.min(...longitudes),
    south: Math.min(...latitudes),
    east: Math.max(...longitudes),
    north: Math.max(...latitudes),
  };
}

function pointInRing(point: Position, ring: Position[]) {
  const [longitude, latitude] = point;
  let inside = false;
  for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index, index += 1) {
    const [currentLongitude, currentLatitude] = ring[index];
    const [previousLongitude, previousLatitude] = ring[previous];
    const crosses = (currentLatitude > latitude) !== (previousLatitude > latitude);
    if (crosses) {
      const crossingLongitude = (previousLongitude - currentLongitude) * (latitude - currentLatitude)
        / (previousLatitude - currentLatitude) + currentLongitude;
      if (longitude < crossingLongitude) inside = !inside;
    }
  }
  return inside;
}

function pointInFeature(point: Position, feature: GeoFeature) {
  const polygons = feature.geometry.type === 'Polygon'
    ? [feature.geometry.coordinates as Position[][]]
    : feature.geometry.coordinates as Position[][][];
  return polygons.some((polygon) => (
    pointInRing(point, polygon[0]) && !polygon.slice(1).some((hole) => pointInRing(point, hole))
  ));
}

function geometryToPositions(geometry: OsmWay['geometry']) {
  return (geometry ?? []).map(({ lon, lat }) => [lon, lat] as Position);
}

function featureMidpoint(coordinates: Position[]): Position | undefined {
  if (!coordinates.length) return undefined;
  const middle = coordinates[Math.floor(coordinates.length / 2)];
  return middle ? [middle[0], middle[1]] : undefined;
}

function featureCentroid(coordinates: Position[]): Position | undefined {
  if (!coordinates.length) return undefined;
  const openRing = coordinates.length > 1 && coordinates[0][0] === coordinates[coordinates.length - 1][0]
    && coordinates[0][1] === coordinates[coordinates.length - 1][1]
    ? coordinates.slice(0, -1)
    : coordinates;
  if (!openRing.length) return undefined;
  const total = openRing.reduce(([sumLongitude, sumLatitude], [longitude, latitude]) => [
    sumLongitude + longitude,
    sumLatitude + latitude,
  ], [0, 0] as Position);
  return [total[0] / openRing.length, total[1] / openRing.length];
}

function parseHeightMeters(tags: Record<string, string> | undefined) {
  const numericHeight = Number.parseFloat(tags?.height ?? '');
  if (Number.isFinite(numericHeight) && numericHeight > 0) return Math.min(numericHeight, 220);
  const levels = Number.parseFloat(tags?.['building:levels'] ?? '');
  return Number.isFinite(levels) && levels > 0 ? Math.min(levels * 3.2, 220) : 12;
}

async function queryOsm(query: string) {
  const response = await fetch('/api/osm-details', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
    body: query,
  });
  if (!response.ok) throw new Error(`OpenStreetMap detail request failed: ${response.status}`);
  return response.json() as Promise<OsmResponse>;
}

function createRoadQuery(bounds: Bounds) {
  const bbox = `${bounds.south},${bounds.west},${bounds.north},${bounds.east}`;
  return `[out:json][timeout:50];way["highway"~"^(motorway|trunk|primary|secondary|tertiary|residential|unclassified)$"](${bbox});out tags geom 850;`;
}

function createBuildingQuery(bounds: Bounds) {
  const bbox = `${bounds.south},${bounds.west},${bounds.north},${bounds.east}`;
  return `[out:json][timeout:50];way["building"](${bbox});out tags geom 1200;`;
}

function buildStreetDetail(street: GeoFeature, roadsResponse: OsmResponse, buildingsResponse: OsmResponse): StreetDetailData {
  const roads = (roadsResponse.elements ?? []).flatMap((way) => {
    const coordinates = geometryToPositions(way.geometry);
    const midpoint = featureMidpoint(coordinates);
    if (coordinates.length < 2 || !midpoint || !pointInFeature(midpoint, street)) return [];
    return [{
      id: `road-${way.id}`,
      kind: way.tags?.highway ?? 'road',
      coordinates,
    }];
  });
  const buildings = (buildingsResponse.elements ?? []).flatMap((way) => {
    const coordinates = geometryToPositions(way.geometry);
    const centroid = featureCentroid(coordinates);
    if (coordinates.length < 4 || !centroid || !pointInFeature(centroid, street)) return [];
    const first = coordinates[0];
    const last = coordinates[coordinates.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) coordinates.push([first[0], first[1]]);
    return [{
      id: `building-${way.id}`,
      heightMeters: parseHeightMeters(way.tags),
      coordinates,
    }];
  });

  return {
    streetGeoData: { type: 'FeatureCollection', features: [street] },
    roads,
    buildings,
    source: 'OpenStreetMap',
    sourceUrl: 'https://www.openstreetmap.org/copyright',
  };
}

export function hasStreetDetail(streetCode: string) {
  return detailCache.has(streetCode) || pendingDetails.has(streetCode);
}

export async function loadStreetDetail(streetCode: string) {
  const cached = detailCache.get(streetCode);
  if (cached) return cached;
  const pending = pendingDetails.get(streetCode);
  if (pending) return pending;
  const street = streetFeatureByCode.get(streetCode);
  if (!street) throw new Error(`No local Shenzhen street boundary found for ${streetCode}`);
  const localDetail = localDetailCacheByCode.get(streetCode);
  if (localDetail) {
    const detail = buildStreetDetail(
      street,
      { elements: localDetail.roads },
      { elements: localDetail.buildings },
    );
    detailCache.set(streetCode, detail);
    return detail;
  }
  const bounds = getBounds(street);
  // Query in sequence so one selected street behaves politely toward the
  // volunteer-operated Overpass mirrors and has a better chance of completing
  // when a public endpoint is busy.
  const loadPromise = queryOsm(createRoadQuery(bounds)).then(async (roads) => {
    const buildings = await queryOsm(createBuildingQuery(bounds));
    const detail = buildStreetDetail(street, roads, buildings);
    detailCache.set(streetCode, detail);
    return detail;
  });
  pendingDetails.set(streetCode, loadPromise);
  try {
    return await loadPromise;
  } finally {
    pendingDetails.delete(streetCode);
  }
}
