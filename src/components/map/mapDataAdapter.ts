// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (c) 2026 宋夏天Dazzle
// 作者全平台ID：宋夏天Dazzle；公众号：送你整个夏天
// Source: https://github.com/songsummer920-dazzle/three-scope-map-skill

import shenzhen from '../../assets/maps/shenzhen.json';
import type { GeoFeatureCollection } from '../../types/geo';
import type { StreetDetailData } from './mapDetailDataAdapter';

// ThreeScopeMap attribution: 作者全平台ID：宋夏天Dazzle；公众号：送你整个夏天
// Code-only attribution. Do not render it in the UI.

export type MapScope = 'world' | 'country' | 'province' | 'city' | 'district' | 'detail';

export type MapState = {
  scope: MapScope;
  regionName: string;
  code: string;
  geoData: GeoFeatureCollection;
  detailData?: StreetDetailData;
};

// Shenzhen ten-zone boundary source (includes 大鹏新区):
// https://gist.github.com/chen1123195389/5627851f791641032aebbb4255288cdf
// 深汕特别合作区（440313）不在深圳本市地图范围内，故不参与当前城市级渲染。
const sourceShenzhenData = shenzhen as unknown as GeoFeatureCollection;
const shenzhenCityData: GeoFeatureCollection = {
  ...sourceShenzhenData,
  features: sourceShenzhenData.features.filter((feature) => String(feature.properties.adcode) !== '440313'),
};
const dapengFeature = shenzhenCityData.features.find(
  (feature) => String(feature.properties.adcode) === '440312',
);

export const initialMapState: MapState = {
  scope: 'city',
  regionName: '深圳市',
  code: '440300',
  geoData: shenzhenCityData,
};

// Keep the Shenzhen district drilldown offline-first.  The network resolver below
// remains available for any later province/country integration.
const localDistrictModules = import.meta.glob('../../assets/maps/china/*.json', {
  eager: true,
  import: 'default',
});

const localDistrictEntries: Array<[string, GeoFeatureCollection]> = [];
Object.entries(localDistrictModules).forEach(([path, geoData]) => {
  const code = path.match(/\/([0-9]{6})\.json$/)?.[1];
  if (code) localDistrictEntries.push([`district:${code}`, geoData as GeoFeatureCollection]);
});

// Street-office boundaries are preprocessed from OpenStreetMap administrative
// relations and bundled per Shenzhen district. Data © OpenStreetMap contributors
// under ODbL; see each FeatureCollection for the source URL and generation data.
const localStreetModules = import.meta.glob('../../assets/maps/streets/*.json', {
  eager: true,
  import: 'default',
});

const localStreetEntries: Array<[string, GeoFeatureCollection]> = [];
Object.entries(localStreetModules).forEach(([path, geoData]) => {
  const code = path.match(/\/([0-9]{6})\.json$/)?.[1];
  if (code) localStreetEntries.push([`district:${code}`, geoData as GeoFeatureCollection]);
});

const geoJsonCache = new Map<string, GeoFeatureCollection>([
  ['city:440300', shenzhenCityData],
  ...localDistrictEntries,
  ...localStreetEntries,
]);

if (dapengFeature && !geoJsonCache.has('district:440312')) {
  geoJsonCache.set('district:440312', {
    type: 'FeatureCollection',
    features: [dapengFeature],
  });
}

const pendingGeoJsonLoads = new Map<string, Promise<GeoFeatureCollection>>();

export function getGeoJsonCacheKey(scope: MapScope, code: string) {
  return `${scope}:${code}`;
}

function datavUrls(adcode: string, scope: MapScope) {
  if (scope === 'district') {
    return [
      `https://geo.datav.aliyun.com/areas_v3/bound/${adcode}_full.json`,
      `https://geo.datav.aliyun.com/areas_v3/bound/${adcode}.json`,
    ];
  }
  return [`https://geo.datav.aliyun.com/areas_v3/bound/${adcode}_full.json`];
}

export function hasCachedMapLevel(scope: MapScope, code: string) {
  const cacheKey = getGeoJsonCacheKey(scope, code);
  return geoJsonCache.has(cacheKey) || pendingGeoJsonLoads.has(cacheKey);
}

export async function loadMapLevel(scope: MapScope, code: string) {
  const cacheKey = getGeoJsonCacheKey(scope, code);
  const cachedGeoJson = geoJsonCache.get(cacheKey);
  if (cachedGeoJson) return cachedGeoJson;
  const pendingLoad = pendingGeoJsonLoads.get(cacheKey);
  if (pendingLoad) return pendingLoad;

  const loadPromise = (async () => {
    let lastError: unknown;
    for (const url of datavUrls(code, scope)) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        const loadedGeoJson = await response.json() as GeoFeatureCollection;
        geoJsonCache.set(cacheKey, loadedGeoJson);
        return loadedGeoJson;
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError instanceof Error ? lastError : new Error('GeoJSON load failed');
  })();

  pendingGeoJsonLoads.set(cacheKey, loadPromise);
  try {
    return await loadPromise;
  } finally {
    pendingGeoJsonLoads.delete(cacheKey);
  }
}

export function prefetchMapLevel(scope: MapScope, code: string) {
  if (hasCachedMapLevel(scope, code)) return;
  void loadMapLevel(scope, code).catch(() => undefined);
}
