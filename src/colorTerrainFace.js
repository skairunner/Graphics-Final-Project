function colorTerrainFace (face, geometry, v1, v2, v3) {

	const z1 = geometry.vertices[v1].z;
	const z2 = geometry.vertices[v2].z;
	const z3 = geometry.vertices[v3].z;

    const level_1 = -2;
	const level_2 = -1;
	const level_3 = 0;
	const level_4 = 1;

	if (z1 <= level_1 || z1 <= level_1 || z3 <= level_1) {
		grass(face);
	}
	else if (z1 <= level_2 || z1 <= level_2 || z3 <= level_2) {
		grassSand(face);
	}
	else if (z1 <= level_3 || z1 <= level_3 || z3 <= level_3) {
		sand(face);
	}
	else if (z1 <= level_4 || z2 <= level_4 || z3 <= level_4) {
		waterSand(face);
	}
	else {
		water(face);
	}
}

function water (face) {
	const r1 = (Math.random() / 10);
	const r2 = (Math.random() / 10);
	const r3 = (Math.random() / 10);
	face.color.setRGB(0.3 + r1, 0.3 + r2, 0.8 + r3);
}

function grass (face) {
	const r1 = (Math.random() / 10);
	const r2 = (Math.random() / 10);
	const r3 = (Math.random() / 10);
	face.color.setRGB(0.3 + r1, 0.8 + r2, 0.3 + r3);
}

function sand (face) {
	const r1 = (Math.random() / 10);
	const r2 = (Math.random() / 10);
	const r3 = (Math.random() / 10);
	face.color.setRGB(0.8 + r1, 0.8 + r2, 0.3 + r3);
}

function grassSand (face) {
	const r1 = (Math.random() / 10);
	const r2 = (Math.random() / 10);
	const r3 = (Math.random() / 10);
	face.color.setRGB(r1 + 0.6, r2 + 0.8, r3 + 0.2);
}

function waterSand (face) {
	const r1 = (Math.random() / 10);
	const r2 = (Math.random() / 10);
	const r3 = (Math.random() / 10);
	face.color.setRGB(0.4 + r1, 0.5 + r2, 0.7 + r3);
}