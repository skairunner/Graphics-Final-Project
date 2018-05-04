const noise = new SimplexNoise();

// Accepting an integer width and height
// Return a (w, h) heightmap.
function MakeTerrain(w, h, scale) {
	const o = [];
	for (let x = 0; x < w; x++) {
		for (let y = 0; y < h; y++) {
			o.push(noise.noise2D(x * scale, y * scale));
		}
	}
	return o;
}