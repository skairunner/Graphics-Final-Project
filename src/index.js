import genTerrain from "./genTerrain";
import SimplexNoise from "simplex-noise";
import * as THREE from "three";
import PointerLockControls from "./three-pointerlock";
import { DDSLoader } from "three-addons";
import MakeTerrain from "./terraingen.js";
import createWaterMesh from "./waterMesh";

document.addEventListener("DOMContentLoaded", start);

const terrainWidth = 200;
const terrainHeight = terrainWidth;
const scale = 4;

var camera, scene, renderer, controls;
var objects = [];
var raycaster, container, content;
var controlsEnabled = false;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var moveUp = false;
var moveDown = false;
var canJump = false;
var velocity, direction;
var prevTime = performance.now();

// let terrain;
const waterRatio = 4;
let waterMesh, waterGeometry;
const waterWidth = terrainWidth / waterRatio;
const waterHeight = waterWidth;
const waterScale = scale * waterRatio;
let offset = 0.0;
let frameCount = 0;

const fogColor = 0xcbecff;
// const fogColor = 0xed5628;

function start() {
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // This section just checks if the libraries and APIs are compatible with the user's browser

  container = document.getElementById("container");
  content = document.getElementById("content");

  var element = document.body;

  var pointerlockchange = function ( event ) {
    if (
      document.pointerLockElement === element || 
      document.mozPointerLockElement === element ||
      document.webkitPointerLockElement === element) {
      controlsEnabled = true;
      controls.enabled = true;
      container.style.display = 'none';
    } else {
      controls.enabled = false;
      container.style.display = 'flex';
      content.style.display = '';
    }
  } ;

  var pointerlockerror = function (event) {
    content.style.display = '';
  };

  document.addEventListener( 'pointerlockchange', pointerlockchange, false );
  document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
  document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

  document.addEventListener( 'pointerlockerror', pointerlockerror, false );
  document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
  document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

  content.addEventListener( 'click', function ( event ) {
    content.style.display = 'none';

    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
    element.requestPointerLock();
  }, false );

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  init(); // this is the function where we initialize all shapes, lights, directions, and the camera
  animate(); // this is the function where we animate motion

  prevTime = performance.now();
  // for the speed of the motion
  velocity = new THREE.Vector3();
  direction = new THREE.Vector3();
}

function init() {
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 4000 ); // create a camera

  // Create a scene with a black background
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2( fogColor, 0.0007 );
  scene.background = new THREE.Color( fogColor );

  // Connect camera to first person view
  controls = new PointerLockControls(camera);
  scene.add(controls.getObject());

  // If the user presses the key, move in the specified direction
  var onKeyDown = function ( event ) {
  if (event.keyCode == 38 || event.keyCode == 87) {
    moveForward = true;
  }

  if (event.keyCode == 37 || event.keyCode == 65)
  {
    moveRight = true;
  }

  if (event.keyCode == 40 || event.keyCode == 83)
  {
    moveBackward = true;
  }

  if (event.keyCode == 39 || event.keyCode == 68)
  {
    moveLeft = true;
  }

  if (event.keyCode == 16) { // 'shift'
    moveDown = true;
  }

  if (event.keyCode == 32) { // 'space'
    moveUp = true;
  }

  if (event.keyCode == 32)
  {
    // if ( canJump === true )
    //   velocity.y += 350;
    // canJump = false;
  }
  };

  // If the user lets go of the key, stop moving
  var onKeyUp = function ( event ) {
    if (event.keyCode == 38 || event.keyCode == 87) {
      moveForward = false;
    }

    if (event.keyCode == 37 || event.keyCode == 65) {
      moveRight = false;
    }

    if (event.keyCode == 40 || event.keyCode == 83) {
      moveBackward = false;
    }

    if (event.keyCode == 39 || event.keyCode == 68) {
      moveLeft = false;
    }

    if (event.keyCode == 16) { // 'shift'
      moveDown = false;
    }

    if (event.keyCode == 32) { // 'space'
      moveUp = false;
    }
  };

  document.addEventListener( 'keydown', onKeyDown, false );
  document.addEventListener( 'keyup', onKeyUp, false );

  raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 20);

  // This is where the triangle strip is defined
  // const terrainWidth = 100;
  // const terrainHeight = terrainWidth;

  const terrain = genTerrain( terrainWidth, terrainHeight, scale );
  [waterMesh, waterGeometry] = createWaterMesh( waterHeight, waterWidth, waterScale, waterRatio, offset );
  // terrain = genTerrain(terrainWidth, terrainHeight, 1 );
  scene.add( waterMesh );
  scene.add( terrain );
  

  // Add a light to the scene

  var light = new THREE.AmbientLight( 0x404040 ); // soft white light
  scene.add( light );

  var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  scene.add( directionalLight );

  // var light2= new THREE.SpotLight( 0xffffff);
  // light2.position.set(100, 100, 0 );

  // light2.angle = Math.PI;
  // light2.penumbra = 0.05;
  // light2.decay = 2;

  // light2.castShadow = true;

  // light2.shadow.mapSize.width = 1000;
  // light2.shadow.mapSize.height = 4000;

  // light2.shadow.camera.near = 10;
  // light2.shadow.camera.far = 4000;
  // light2.shadow.camera.fov = 90;

  // scene.add(light2);

  // Add a renderer to ensure that the graphics display properly
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.id = 'canvas';

  window.addEventListener('resize', function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
  // renderer.domElement.style.filter = 'blur(10px)';

  document.body.appendChild( renderer.domElement );


  renderer.render(scene, camera);
}

function animate()
{
  requestAnimationFrame( animate );
  frameCount++;

  camera.position.set(0, 0, 0);
  camera.rotation.z = Math.PI;
  // Set movement speed
  if (controlsEnabled === true) {
    raycaster.ray.origin.copy(controls.getObject().position);
    raycaster.ray.origin.y -= 10;

    var intersections = raycaster.intersectObjects(objects);

    var onObject = intersections.length > 0;

    var time = performance.now();
    var delta = ( time - prevTime ) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    velocity.y -= velocity.y * 10.0 * delta;

    // velocity.y -= 9.8 * 100.0 * delta;

    direction.z = Number( moveForward ) - Number( moveBackward );
    direction.x = Number( moveLeft ) - Number( moveRight );
    direction.y = Number( moveUp ) - Number( moveDown );
    // direction.normalize();

    if ( moveForward || moveBackward ) velocity.z -= direction.z * 500.0 * delta;
    if ( moveLeft || moveRight ) velocity.x -= direction.x * 500.0 * delta;
    if ( moveUp || moveDown ) velocity.y -= direction.y * 500.0 * delta;

    // if ( onObject === true ) {
    //   velocity.y = Math.max( 0, velocity.y );
    //   canJump = true;
    // }

    controls.getObject().translateX( velocity.x * delta );
    controls.getObject().translateY( velocity.y * delta );
    controls.getObject().translateZ( velocity.z * delta );

    // if ( controls.getObject().position.y < 10 ) {
    //   velocity.y = 0;
    //   controls.getObject().position.y = 10;

    //   canJump = true;
    // }

    prevTime = time;

  }

  if (frameCount % 6 < 0.1) {
    scene.remove(waterMesh);

    [waterMesh, waterGeometry] = createWaterMesh( waterHeight, waterWidth, waterScale, waterRatio, offset );
    waterGeometry.dispose();

    scene.add(waterMesh);
    offset += 0.15;
  } 

  renderer.render(scene, camera);
}
