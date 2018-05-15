import * as THREE from "three";

import Colors from "./colorTerrainFace";
import genTriangleStripGeometry from "./genTriangleStripGeometry";
import SimplexNoise from "simplex-noise";

import reposition from "./genTerrain";

const simplex = new SimplexNoise;

const waterNoise = {
    z: function ( ratio, offset ) {
        return ( i, j ) => {
        const scaling = 0.1;
        return simplex.noise3D(i * scaling, j * scaling, offset * scaling) / ratio;
        // return Math.random();
        }
    }
};

const waterEmissiveColor = 0x5dc0cd;
const waterColor = Colors.waterColor;

// const waterMaterial = new THREE.MeshBasicMaterial ({
//     side: THREE.DoubleSide,
//     vertexColors: THREE.FaceColors,
//     transparent: true,
//     opacity: 0.6
// });

const waterMaterial = new THREE.MeshLambertMaterial ({
    // side: THREE.DoubleSide,
    vertexColors: THREE.FaceColors,
    transparent: true,
    opacity: 0.75,
    emissive: waterEmissiveColor
});

// const waterMaterial = new THREE.MeshPhysicalMaterial ({
//     // side: THREE.DoubleSide,
//     vertexColors: THREE.FaceColors,
//     transparent: true,
//     opacity: 0.75,
//     emissive: waterEmissiveColor,
//     clearCoat: 0.5,
//     reflectivity: 0.75
// });

export default function createWaterMesh( rows, cols, scale, ratio, offset ) {
    const waterGeometry = genTriangleStripGeometry( rows, cols, waterNoise.z(ratio, offset), waterColor, true, scale );
    const waterMesh = new THREE.Mesh( waterGeometry, waterMaterial );

    waterMesh.position.set( 0, 0, 0 );
    waterMesh.translateY( 75 );
    waterMesh.translateZ( scale*-rows/2 );
    waterMesh.translateX( scale*-rows/2 );
    waterMesh.rotateX(Math.PI/2);

    return [waterMesh, waterGeometry];
}