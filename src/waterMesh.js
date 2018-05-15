import * as THREE from "three";

import Colors from "./colorTerrainFace";
import genTriangleStripGeometry from "./genTriangleStripGeometry";
import SimplexNoise from "simplex-noise";

import reposition from "./genTerrain";

const simplex = new SimplexNoise;

const waterNoise = {
    z: function ( offset ) {
        return ( i, j ) => {
        const scaling = 0.1;
        return simplex.noise3D(i * scaling, j * scaling, offset * scaling) * 0.75;
        // return Math.random();
        }
    }
};

const waterColor = Colors.waterColor;

const waterMaterial = new THREE.MeshBasicMaterial ({
    side: THREE.DoubleSide,
    vertexColors: THREE.FaceColors,
    transparent: true,
    opacity: 0.6
});

export default function createWaterMesh( rows, cols, scale, offset ) {
    const waterGeometry = genTriangleStripGeometry( rows, cols, waterNoise.z(offset), waterColor, true, scale );
    const waterMesh = new THREE.Mesh( waterGeometry, waterMaterial );

    waterMesh.position.set( 0, 0, 0 );
    waterMesh.translateY( 75 );
    waterMesh.translateZ( scale*-rows/2 );
    waterMesh.translateX( scale*-rows/2 );
    waterMesh.rotateX(Math.PI/2);

    return [waterMesh, waterGeometry];
}