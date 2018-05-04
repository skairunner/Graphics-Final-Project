import SimplexNoise from "simplex-noise";

const noise = new SimplexNoise();

// From https://cmaher.github.io/posts/working-with-simplex-noise/
function octaves(it, x, y, persist, scale, low, high) {
	let maxAmp = 0;
	let amp = 1;
	let freq = scale;
	let out = 0;

	for (let i = 0; i < it; i++) {
		out += noise.noise2D(x * freq, y * freq) * amp;
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
	const o = [];
	for (let x = 0; x < w; x++) {
		for (let y = 0; y < h; y++) {
			o.push(octaves(8, x, y, 0.5, scale, -5, 7));
		}
	}
	return o;
}