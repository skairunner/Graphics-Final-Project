import * as THREE from "three";
import { TerrainColors, GetTileColor, Perturb } from "./constants.js";

function averagecolor(rgb1, rgb2, rgb3) {
    return [
        (rgb1[0] + rgb2[0] + rgb3[0])/3,
        (rgb1[1] + rgb2[1] + rgb3[1])/3,
        (rgb1[2] + rgb2[2] + rgb3[2])/3
    ]
}

export default function genTriangleStripGeometry ( rows, cols, noise, color, constantmode, scale = 1 ) {
    const geometry = new THREE.Geometry();
    _buildVertices( geometry, noise, color, scale, rows, cols );
    _buildFaces( geometry, color, rows, cols, constantmode );
    return geometry;
}

function _buildVertices ( geometry, noise, color, scale, rows, cols ) {
    for ( let i = 0; i <= rows; i++ ) {
        for ( let j = 0; j <= cols; j++ ) {
            const z = noise(j, i);
            const vector3 = new THREE.Vector3( j*scale, i*scale, z*scale );
            geometry.vertices.push( vector3 );
            // geometry.colors.push( GetTileColor(color(i, j)) );
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

function _setcol(face, v1, v2, v3, types, geometry) {
    // Find the majority
    const t1 = types.types[v1];
    const t2 = types.types[v2];
    const t3 = types.types[v3];

    let colors = {}
    colors[t1] = 1;
    if (t2 in colors) colors[t2] += 1; else colors[t2] = 1;
    if (t3 in colors) colors[t3] += 1; else colors[t3] = 1;
    let maxtype = t1;
    let maxcount = colors[t1];
    for (let type in colors) {
        if (colors.hasOwnProperty(type)) {
            if (maxcount < colors[type]) {
                maxtype = type;
                maxcount = colors[type];
            }
        }
    }
    const col = TerrainColors[maxtype];
    face.color = (new THREE.Color()).fromArray(Perturb(col));
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
        _setcol(face, v1, v2, v3, color, geometry);
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
        _setcol(face, v1, v2, v3, color, geometry);
    }
    return face;
}
