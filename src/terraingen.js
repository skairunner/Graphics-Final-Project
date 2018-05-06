import SimplexNoise from "simplex-noise";

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
  const height = [];
  const types = [];
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      let z = octaves(8, x, y, 0.1, 0.5, scale, -5, 10) - 3;

      let isMountainy = octaves(4, x, y, 2, 0.5, scale, -1, 1);
      if (0 < z && z < 2) {
        z = lerp(z, z * octaves(8, x, y, 1, 0.5, scale, 1, 20), isMountainy * z/2);
      } else if (z > 2) {
        z = lerp(z, z * octaves(8, x, y, 1, 0.5, scale, 1, 20), isMountainy);
      }
      height.push(z);
      types.push(0);
    }
  }
  return {z: (x, y) => height[x + y * w], t: (x, y) => types[x + y * w]};
}