import * as THREE from "three";
import colorTerrainFace from "./colorTerrainFace";

export default function genTerrain ( rows = 5, cols = 5, noise = () => { return 0; } ) {
    const terrainBuilder = new TerrainBuilder( rows, cols, noise );
    return terrainBuilder.genTerrain();
}

class TerrainBuilder {

    constructor ( rows = 5, cols = 5, noise = () => { return 0; } ) {
        this._rows = rows;
        this._cols = cols;
        this._noise = noise;
    }

    genTerrain () {
        const mesh = this._genTriangleStrip();
        const wireframe = this._genWireframe();
        this.terrain = new THREE.Group();
        this.terrain.add( mesh );
        this.terrain.add( wireframe );
        this._reposition();
        return this.terrain;
    }

    /*
        Create the geometry for a triangle strip based on the rows and
        cols, and create a mesh from the geometry.
    */

    _genTriangleStrip () {
        this._buildGeometry();
        return this._genMesh();
    }

    /*
        Generate the geometry for a triangle mesh with vertices and
        faces based on the rows and cols given.
    */

    _buildGeometry () {
        this.geometry = new THREE.Geometry();
        this._buildVertices();
        this._buildFaces();
    }

    /*
        Build a matrix of vectors and add them to the
        geometry.
    */

    _buildVertices () {
        for ( let i = 0; i <= this._rows; i++ ) {
            for ( let j = 0; j <= this._cols; j++ ) {
                const z = this._noise( i, j );
                const vector3 = new THREE.Vector3( j, i, z );
                this.geometry.vertices.push( vector3 );
            }
        }
    }

    /*
        Build the faces from the bottom left corner and top right
        corner simultaneously, and adds them to the geometry.
    */

    _buildFaces () {
        for ( let j = 0; j < this._rows; j++ ) {
            for ( let i = 0; i < this._cols; i++ ) {
                const face1 = this._genFace1( i, j );
                const face2 = this._genFace2( i, j );
                this.geometry.faces.push( face1, face2 );
            }
        }
    }

    _genFace1 ( i, j ) {
        const cols = this._cols + 1,
              v1 = ( j*cols ) + ( i ),
              v2 = ( j*cols ) + ( i + 1 ),
              v3 = ( j*cols ) + ( cols + i ),
              face = new THREE.Face3( v1, v2, v3 );
        colorTerrainFace(face, this.geometry, v1, v2, v3);
        return face;
    }

    _genFace2 ( i, j ) {
        const rows = this._rows + 1,
              cols = this._cols + 1,
              v1 = ( rows*cols ) - ( j*cols ) - ( i+1 ),
              v2 = ( rows*cols ) - ( j*cols ) - ( i+2 ),
              v3 = ( rows*cols ) - ( ( j+1 ) * cols ) - ( i+1 ),
              face = new THREE.Face3( v1, v2, v3 );
        colorTerrainFace(face, this.geometry, v1, v2, v3);
        return face;
    }

    /*
        Generate a double sided basic mesh.
    */

    _genMesh () {
        const material = new THREE.MeshBasicMaterial ({
            side: THREE.DoubleSide,
            vertexColors: THREE.FaceColors
        });
        return new THREE.Mesh( this.geometry, material );
    }

    /*
        Generate a wireframe mesh and position it just above the
        original geometry.
    */

    _genWireframe () {
        if (!this.geometry) {
            this.geometry = this._buildGeometry();
        }
        const material = new THREE.MeshBasicMaterial ({
            color: 0x444444,
            wireframe: true
        });
        const mesh = new THREE.Mesh(this.geometry, material);
        mesh.translateZ(0.017);
        return mesh;
    }

    _reposition () {
        this.terrain.translateX( -1 * Math.floor( this._cols/2 ) );
        this.terrain.translateY( -1 * Math.floor( this._rows/2 ) );
        this.terrain.rotateX(Math.PI/2);
        this.terrain.translateZ( -150 );
        this.terrain.translateY( -150 );
    }
}
