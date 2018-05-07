import SimplexNoise from "simplex-noise";
import PerlinNoise2D from "./exponential-perlin.js";
import { TerrainTypes } from "./constants.js";
import rescale from "ml-array-rescale";

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
  const height = new Array(w * h);
  const types = new Array(w * h);
  const humidity = new Float32Array(w * h);
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      // ~-20 to 20 for some reason
      let z = PerlinNoise2D(x * scale , y * scale, 8) * 100;
      height[x + y * w] = z;
      humidity[x + y * w] = octaves(4, x, y, 0.1, 0.5, 0.05, 0, 10);
    }
  }
  // rescale(height, {min: -10, max: 20, output: height});

  // const rainfall = new Float32Array(w * h);
  // LET'S DO RAIN SHADOWS
  // Every tick, wind blows towards +x.
  // Pick up water over oceans, drop water when rising in elevation.


  // For now just color by altitude
  for (let i = 0; i < w * h; i++) {
    let z = height[i];
    if (z < -10) types[i] = TerrainTypes.SAND;//TerrainTypes.DEEP_WATER;
    else if (z < 0) types[i] = TerrainTypes.SAND;//TerrainTypes.SHALLOW_WATER;
    else if (z < 2) types[i] = TerrainTypes.SAND;
    else if (z < 5) types[i] = TerrainTypes.LOW_LAND;
    else types[i] = TerrainTypes.HIGH_LAND;

    // types[i] = Math.floor(humidity[i] / 10 * 3);
  }

  const typefunc = function(x, y) { return this.types[x + y * w]; };
  typefunc.types = types;

  return {z: (x, y) => height[x + y * w], t: typefunc};
}