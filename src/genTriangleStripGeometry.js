import * as THREE from "three";
import { TerrainColors, GetTileColor } from "./constants.js";

export default function genTriangleStripGeometry ( rows, cols, noise, color, constantmode, scale = 1 ) {
    const geometry = new THREE.Geometry();
    _buildVertices( geometry, noise, color, scale, rows, cols );
    _buildFaces( geometry, color, rows, cols, constantmode );
    return geometry;
}

function _buildVertices ( geometry, noise, color, scale, rows, cols ) {
    for ( let i = 0; i <= rows; i++ ) {
        for ( let j = 0; j <= cols; j++ ) {
            const z = noise(i, j);
            const vector3 = new THREE.Vector3( j*scale, i*scale, z*scale );
            geometry.vertices.push( vector3 );
            geometry.colors.push( GetTileColor(color(i, j)) );
        }
    }
}

function _buildFaces ( geometry, color, rows, cols, constantmode ) {
    for ( let j = 0; j < rows; j++ ) {
        for ( let i = 0; i < cols; i++ ) {
            const face1 = _genFace1( geometry, color, i, j, cols+1, constantmode );
            const face2 = _genFace2( geometry, color, i, j, rows+1, cols+1, constantmode );
            geometry.faces.push( face1, face2 );
        }
    }
}

function _genFace1 ( geometry, color, i, j, cols, constantmode ) {
    const v1 = ( j*cols ) + ( i );
    const v2 = ( j*cols ) + ( i + 1 );
    const v3 = ( j*cols ) + ( cols + i );
    const face = new THREE.Face3( v1, v2, v3 );
    // Lookup colors
    if (constantmode) {
        color(face, geometry, v1, v2, v3);
    } else {
        // types
        const c1 = geometry.colors[v1];
        const c2 = geometry.colors[v2];
        const c3 = geometry.colors[v3];
        face.vertexColors = [c1, c2, c3];
    }
    return face;
}

function _genFace2 ( geometry, color, i, j, rows, cols, constantmode ) {
    const v1 = ( rows*cols ) - ( j*cols ) - ( i+1 );
    const v2 = ( rows*cols ) - ( j*cols ) - ( i+2 );
    const v3 = ( rows*cols ) - ( ( j+1 ) * cols ) - ( i+1 );
    const face = new THREE.Face3( v1, v2, v3 );
    // Lookup colors
    if (constantmode) {
        color(face, geometry, v1, v2, v3);
    } else {
        // types
        const c1 = geometry.colors[v1];
        const c2 = geometry.colors[v2];
        const c3 = geometry.colors[v3];
        face.vertexColors = [c1, c2, c3];
    }
    return face;
}
