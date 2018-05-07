import * as THREE from "three";
import Colors from "./colorTerrainFace";
import MakeTerrain from "./terraingen.js";
import genTriangleStripGeometry from "./genTriangleStripGeometry";

export default function genTerrain ( rows, cols, scale ) {

    /*
        Build the geometry, material, and mesh of the terrain.
    */

    const makeTerrain = MakeTerrain( rows + 1, cols + 1, 0.01 );
    const terrainColor = Colors.terrainColor;

    // const terrainGeometry = genTriangleStripGeometry( rows, cols, makeTerrain.z, terrainColor, scale );
    const terrainGeometry = genTriangleStripGeometry( rows, cols, makeTerrain.z, makeTerrain.t, false, scale );
    const terrainMaterial = new THREE.MeshBasicMaterial ({
        side: THREE.DoubleSide,
        // vertexColors: THREE.FaceColors
        vertexColors: THREE.VertexColors
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

    const waterNoise = {
        z: function ( i, j ) {
            return Math.random();
        }
    };
    // const waterColor = Colors.waterColor;

    // const waterGeometry = genTriangleStripGeometry( rows, cols, waterNoise.z, waterColor, true, scale );
    // const waterMaterial = new THREE.MeshBasicMaterial ({
    //     side: THREE.DoubleSide,
    //     vertexColors: THREE.FaceColors,
    //     transparent: true,
    //     opacity: 0.5
    // });
    // const waterMesh = new THREE.Mesh( waterGeometry, waterMaterial );

    /*
        Group the three together, and reposition them before returning.
    */

    const terrain = new THREE.Group();
    terrain.add( terrainMesh );
    // terrain.add( terrainWireframeMesh );
    // terrain.add( waterMesh );
    _reposition( terrain, rows, cols, scale );
    return terrain;
}

function _reposition ( terrain, rows, cols, scale ) {
    terrain.position.set( 0, 0, 0 );
    terrain.translateY( 75 );
    terrain.translateZ( scale*-rows/2 );
    terrain.translateX( scale*-rows/2 );
    terrain.rotateX(Math.PI/2);
}
