/*
    Scenes allow you to set up what and where is to be rendered by
    three.js. This is where you place objects, lights, and cameras.
*/

const scene = new THREE.Scene();

/*
	This projection mode is designed to mimic the way the human eye
	sees. It is the most common projection mode used for rendering a
	3D scene.
*/

const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

camera.position.z = 20;

/*
	The WebGL renderer displays the scenes using WebGL.
*/

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function triangleStrip(rows, cols) {

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

const plane = triangleStrip(100, 50);

scene.add(plane);

/*
	Add the group to the scene.
*/

// scene.add(cube);

/*
	Create a loop that causes the renderer to draw the scene every
	time the screen is refreshed.
*/


camera.rotation.x += 1;

function animate() {

	requestAnimationFrame(animate);

	camera.position.y += 0.01;

	renderer.render(scene, camera);
}


animate();
