import * as THREE from "three";

import Colors from "./colorTerrainFace";
import genTriangleStripGeometry from "./genTriangleStripGeometry";
import SimplexNoise from "simplex-noise";

const simplex = new SimplexNoise;

const waterNoise = {
    z: function ( offset ) {
        return ( i, j ) => {
        const scaling = 0.1;
        return simplex.noise2D((i + offset) * scaling, (j + offset) * scaling);
        // return Math.random();
        }
    }
};

const waterColor = Colors.waterColor;

export default function createWaterMesh( rows, cols, scale, offset ) {
    const waterGeometry = genTriangleStripGeometry( rows, cols, waterNoise.z(offset), waterColor, true, scale );
    const waterMaterial = new THREE.MeshBasicMaterial ({
        side: THREE.DoubleSide,
        vertexColors: THREE.FaceColors,
        transparent: true,
        opacity: 0.6
    });
    const waterMesh = new THREE.Mesh( waterGeometry, waterMaterial );

    return waterMesh;
}