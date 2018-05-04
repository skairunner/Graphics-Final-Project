function makeTriangleStrip(rows, cols) {
	const simplex = new SimplexNoise();
	const scaling = .025;
	const scaling2 = 0.5;

	rows++;
	cols++;

	const geometry = new THREE.Geometry();

	let matrix = [];

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			let z = simplex.noise2D(j * scaling, i * scaling) * 10 + simplex.noise2D(j * scaling2, i * scaling2);
			geometry.vertices.push (
				new THREE.Vector3(j, i, z)
				// new THREE.Vector3(j, i, (Math.random()/5) + 10 * Math.sin(i / 10))
			);
		}
	}

	for (let j = 0; j < rows-1; j++) {
		for (let i = 0; i < cols-1; i++) {

			const v1 = (j*cols) + i;
			const v2 = (j*cols) + (i+1);
			const v3 = (j*cols) + (cols+i);
			const face_1 = new THREE.Face3 (v1, v2, v3);
			colorTerrainFace(face_1, geometry, v1, v2, v3);

			const v4 = (rows*cols) - (j * cols) - (i+1);
			const v5 = (rows*cols) - (j * cols) - (i+2);
			const v6 = (rows*cols) - ((j+1) * cols) - (i+1);
			const face_2 = new THREE.Face3 (v4, v5, v6);
			colorTerrainFace(face_2, geometry, v4, v5, v6);

			geometry.faces.push (
				face_1,
				face_2
			);
		}
	}

	const wireframeMaterial = new THREE.MeshBasicMaterial ({
		color: 0x444444,
		wireframe: false
	});

	const planeMaterial = new THREE.MeshBasicMaterial ({
		vertexColors: THREE.FaceColors,
		side: THREE.DoubleSide
	});

	const plane = new THREE.Mesh(geometry, planeMaterial);
	const wireframe = new THREE.Mesh(geometry, wireframeMaterial);
	wireframe.translateZ(-0.015);

	const terrain = new THREE.Group();
	terrain.add(plane);
	terrain.add(wireframe);

	terrain.translateX(-cols/2);
	terrain.translateY(-rows/(rows / 15));

	return terrain;
}
