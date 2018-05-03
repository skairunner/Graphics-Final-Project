function makeTriangleStrip(rows, cols) {

	rows++;
	cols++;

	const geometry = new THREE.Geometry();

	let matrix = [];
	
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			geometry.vertices.push (
				new THREE.Vector3(j, i, Math.sin(i))
			);
		}
	}

	for (let j = 0; j < rows-1; j++) {
		for (let i = 0; i < cols-1; i++) {
			geometry.faces.push (
				new THREE.Face3 (
					(j*cols) + i,
					(j*cols) + (i+1),
					(j*cols) + (cols+i)
				),
				new THREE.Face3 (
					(rows*cols) - (j * cols) - (i+1),
					(rows*cols) - (j * cols) - (i+2),
					(rows*cols) - ((j+1) * cols) - (i+1)
				)
			);
		}
	}

	var material = new THREE.MeshBasicMaterial( {
		color: 0xffffff,
		wireframe: true
	});

	var plane = new THREE.Mesh(geometry, material);

	plane.drawMode = THREE.TriangleStripDrawMode;

	plane.translateX(-cols/2);
	plane.translateY(-rows/(rows / 15));

	return plane;
}
