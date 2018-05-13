import * as THREE from "three";

export const TerrainTypes = {
  NONE: 0,
  DEEP_WATER: 1,
  SHALLOW_WATER: 2,
  LOW_LAND: 3,
  HIGH_LAND: 4,
  SAND: 5,
  DRY_LAND: 6,
  MEDIUM_LAND: 7
};

export const TerrainColors = {};
TerrainColors[TerrainTypes.NONE] = [1, 0, 1];
TerrainColors[TerrainTypes.DEEP_WATER] = [0, 0, 0xAA/256];
TerrainColors[TerrainTypes.SHALLOW_WATER] = [0, 0.2, 0xCC/256];
TerrainColors[TerrainTypes.DRY_LAND] = [.6, .75, .2];
TerrainColors[TerrainTypes.LOW_LAND] = [.6, .7, .2];
TerrainColors[TerrainTypes.MEDIUM_LAND] = [130/255, 155/255, 32/255];
TerrainColors[TerrainTypes.HIGH_LAND] = [94/255, 124/255, 51/255];
TerrainColors[TerrainTypes.SAND] = [.8, .8, .3];

export function Perturb(rgb) {
  return [rgb[0] + Math.random()/10,
          rgb[1] + Math.random()/10,
          rgb[2] + Math.random()/10];
}

// perturbs colors a bit
export function GetTileColor(terrtype) {
  const origcol = TerrainColors[terrtype];
  return new THREE.Color(...Perturb(origcol));
}