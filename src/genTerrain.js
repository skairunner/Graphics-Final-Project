import * as THREE from "three";
import Colors from "./colorTerrainFace";
import MakeTerrain from "./terraingen.js";
import genTriangleStripGeometry from "./genTriangleStripGeometry";

export default function genTerrain ( rows, cols, scale ) {

    /*
        Build the geometry, material, and mesh of the terrain.
    */

    const terrainNoise = MakeTerrain( rows, cols, 0.01 );
    const terrainColor = Colors.terrainColor;

    const terrainGeometry = genTriangleStripGeometry( rows, cols, terrainNoise, terrainColor, scale );
    const terrainMaterial = new THREE.MeshBasicMaterial ({
        side: THREE.DoubleSide,
        vertexColors: THREE.FaceColors
    });
    const terrainMesh = new THREE.Mesh( terrainGeometry, terrainMaterial );

    /*
        Build the geometry, material, and mesh of the terrain's wireframe.
    */

    const terrainWireframeGeometry = terrainGeometry;
    const terrainWireframeMaterial = new THREE.MeshBasicMaterial ({
        color: 0x444444,
        wireframe: true
    });
    const terrainWireframeMesh = new THREE.Mesh( terrainWireframeGeometry, terrainWireframeMaterial );
    terrainWireframeMesh.translateZ( 0.017 );

    /*
        Build the geometry, material, and mesh of the water.
    */

    const waterNoise = function ( i, j ) {
        return Math.random();
    };
    const waterColor = Colors.waterColor;

    const waterGeometry = genTriangleStripGeometry( rows, cols, waterNoise, waterColor, scale );
    const waterMaterial = new THREE.MeshBasicMaterial ({
        transparent: true,
        opacity: 0.5
    });

    const terrain = new THREE.Group();
    terrain.add( terrainMesh );
    terrain.add( terrainWireframeMesh );
    _reposition( terrain, rows, cols );
    return terrain;
}

function _reposition ( terrain, rows, cols ) {
    terrain.translateX( -1 * Math.floor( cols/2 ) );
    terrain.translateY( -1 * Math.floor( rows/2 ) );
    terrain.rotateX(Math.PI/2);
    terrain.translateZ( -150 );
    terrain.translateY( -150 );
}

