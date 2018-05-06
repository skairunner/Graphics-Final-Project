import * as THREE from "three";

export default function genTriangleStripGeometry ( rows, cols, noise, color, scale = 1 ) {
    const geometry = new THREE.Geometry();
    _buildVertices( geometry, noise, scale, rows, cols );
    _buildFaces( geometry, color, rows, cols );
    return geometry;
}

function _buildVertices ( geometry, noise, scale, rows, cols ) {
    for ( let i = 0; i <= rows; i++ ) {
        for ( let j = 0; j <= cols; j++ ) {
            const z = noise[i+j*rows];
            const vector3 = new THREE.Vector3( j*scale, i*scale, z*scale );
            geometry.vertices.push( vector3 );
        }
    }
}

function _buildFaces ( geometry, color, rows, cols ) {
    for ( let j = 0; j < rows; j++ ) {
        for ( let i = 0; i < cols; i++ ) {
            const face1 = _genFace1( geometry, color, i, j, cols+1 );
            const face2 = _genFace2( geometry, color, i, j, rows+1, cols+1 );
            geometry.faces.push( face1, face2 );
        }
    }
}

function _genFace1 ( geometry, color, i, j, cols ) {
    const v1 = ( j*cols ) + ( i );
    const v2 = ( j*cols ) + ( i + 1 );
    const v3 = ( j*cols ) + ( cols + i );
    const face = new THREE.Face3( v1, v2, v3 );
    color(face, geometry, v1, v2, v3);
    return face;
}

function _genFace2 ( geometry, color, i, j, rows, cols ) {
    const v1 = ( rows*cols ) - ( j*cols ) - ( i+1 );
    const v2 = ( rows*cols ) - ( j*cols ) - ( i+2 );
    const v3 = ( rows*cols ) - ( ( j+1 ) * cols ) - ( i+1 );
    const face = new THREE.Face3( v1, v2, v3 );
    color(face, geometry, v1, v2, v3);
    return face;
}
