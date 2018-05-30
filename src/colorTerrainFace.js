export default {
	    terrainColor ( face, geometry, v1, v2, v3, scale = 1 ) {
	
	        const z1 = geometry.vertices[v1].z;
	        const z2 = geometry.vertices[v2].z;
	        const z3 = geometry.vertices[v3].z;
	    
	        const level_1 =  1*scale;
	        const level_2 =  0;
	        const level_3 = -1*scale;
	        const level_4 = -2*scale;
	    
	        if      (isUnder( z1, z2, z3, level_1 )) grass(face);
	        else if (isUnder( z1, z2, z3, level_2 )) grassSand(face);
	        else if (isUnder( z1, z2, z3, level_3 )) sand(face);
	        else if (isUnder( z1, z2, z3, level_4 )) waterSand(face);
	        else                                     water(face);
	    },
	
	    waterColor (face) {
			const r1 = Math.random() / 10;
			const r2 = Math.random() / 10;
			const r3 = Math.random() / 10;
			// const r1 = 0;
			// const r2 = 0;
			// const r3 = 0;
			face.color.setRGB(0.0 + r1, 0.3 + r2, 0.9 + r3);
		}
	};
	
	function isUnder ( z1, z2, z3, level ) {
	    if (z1 >= level || z1 >= level || z3 >= level) {
	        return true;
	    }
	}
	
	function water (face) {
	    const r1 = (Math.random() / 10);
	    const r2 = (Math.random() / 10);
	    const r3 = (Math.random() / 10);
	    face.color.setRGB(0.3 + r1, 0.3 + r2, 0.8 + r3);
	}
	
	function grass (face) {
	    const r1 = (Math.random() / 10);
	    const r2 = (Math.random() / 10);
	    const r3 = (Math.random() / 10);
	    face.color.setRGB(0.2 + r1, 0.8 + r2, 0.1 + r3);
	}
	
	function sand (face) {
	    const r1 = (Math.random() / 20);
	    const r2 = (Math.random() / 30);
	    const r3 = (Math.random() / 10);
	    face.color.setRGB(0.95 + r1, 0.7 + r2, 0.6 + r3);

	}
	
	function grassSand (face) {
	    const r1 = (Math.random() / 10);
	    const r2 = (Math.random() / 10);
	    const r3 = (Math.random() / 10);
	    face.color.setRGB(r1 + 0.7, r2 + 0.8, r3 + 0.2);
	}
	
	function waterSand (face) {
	    const r1 = (Math.random() / 10);
	    const r2 = (Math.random() / 10);
	    const r3 = (Math.random() / 10);
	    face.color.setRGB(0.4 + r1, 0.5 + r2, 0.7 + r3);
	}
	