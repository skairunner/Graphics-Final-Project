import SimplexNoise from "simplex-noise";
import PerlinNoise2D from "./exponential-perlin.js";
import { TerrainTypes } from "./constants.js";
import * as ndarray from "ndarray";
import * as gaussian from "ndarray-gaussian-filter";

function lerp(a, b, t) {
  return (1 - t)* a + t * b;
}

const noise = new SimplexNoise();

// From https://cmaher.github.io/posts/working-with-simplex-noise/
function octaves(it, x, y, z, persist, scale, low, high) {
  let maxAmp = 0;
  let amp = 1;
  let freq = scale;
  let out = 0;

  for (let i = 0; i < it; i++) {
    out += noise.noise3D(x * freq, y * freq, z) * amp;
    maxAmp += amp;
    amp *= persist;
    freq *= 2;
  }
  out /= maxAmp;
  out = out * (high - low) / 2 + (high + low) / 2
  return out;
}

// Accepting an integer width and height
// Return a (w, h) heightmap.
export default function MakeTerrain(w, h, scale) {
  const OCEAN_HUMIDITY = 4;
  const height = new Array(w * h);
  const types = new Array(w * h);
  let humidity1 = new Float32Array(w * h);
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      // ~-20 to 20 for some reason
      let z = PerlinNoise2D(x * scale , y * scale, 8) * 100;
      height[x + y * w] = z;
      humidity1[x + y * w] = octaves(4, x, y, 0.1, 0.5, 0.05, 0, 10) + (z < 0 ? OCEAN_HUMIDITY : 0);
    }
  }

  let rainfall = new Float32Array(w * h);
  let humidity2 = new Float32Array(w * h);
  // LET'S DO RAIN SHADOWS
  // Every tick, wind blows towards +x.
  // Pick up water over oceans, drop water when rising in elevation.
  for (let i = 0; i < w; i++) {
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        const INDEX = x + y * w;
        const z = height[INDEX];
        let X = (x == 0 ? w - 1 : x - 1);
        humidity2[INDEX] = humidity1[X + y * w]; // + (z < 0 ? OCEAN_HUMIDITY : 0);
        let dropped = 0;
        if (z > 0 && humidity2[INDEX] > .1) {
          humidity2[INDEX] -= .1;
          dropped += .1;
        }
        if (z > 0 && humidity2[INDEX] > 50 - z) {
          dropped = (humidity2[INDEX] - (50 - z))  *.1;
          humidity2[INDEX] -= dropped;
        }
        rainfall[INDEX] += dropped;
      }
    }
    const temp = humidity1;
    humidity1 = humidity2;
    humidity2 = temp;
  }
  // Do blurring
  let arr = ndarray(rainfall, [w, h]);
  arr = gaussian(arr, 5, true);

  // For now just color by altitude
  for (let i = 0; i < w * h; i++) {
    let h = arr.get(i % w, Math.floor(i / w));
    if (height[i] < .5) types[i] = TerrainTypes.SAND;
    else if (h < 10) types[i] = TerrainTypes.DRY_LAND;
    else if (h < 20) types[i] = TerrainTypes.LOW_LAND;
    else if (h < 40) types[i] = TerrainTypes.MEDIUM_LAND;
    else types[i] = TerrainTypes.HIGH_LAND;
  }

  const typefunc = function(x, y) { return this.types[x + y * w]; };
  typefunc.types = types;

  return {z: (x, y) => height[x + y * w], t: typefunc};
}