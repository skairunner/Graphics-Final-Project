// adopted from https://github.com/Ian-Parberry Generate With Perlin Noise
// perlin.h, perlin.cpp

const B = 0x100;  // Perlin's B, a power of 2 usually equal to 256.
const BM = 0xff;  // A bit mask, one less than B.
const N = 0x1000; // Perlin's N.
const g_fMu = 1.02; // gradient magnitude exponent
const FM_SQRT2 = Math.sqrt(2); // square root of 2

const lerp = (t, a, b) => a + t * (b - a);
const s_curve = (t) => t * t * (3 - 2 * t);

// Perlin's setup macro. Must be done manually.
/*
#define setup(i,b0,b1,r0,r1)\
  t = vec[i] + N;\
  b0 = ((int)t) & BM;\
  b1 = (b0+1) & BM;\
  r0 = t - (int)t;\
  r1 = r0 - 1.0f;
*/
const at2 = (q, rx, ry) => rx * q[0] + ry * q[1];

const p = new Int32Array(B); // Perlin's permutation table
const _g2 = new Float32Array(B*2); // Perlin's gradient table
const get_g2 = (x, y) => _g2[x + y * 2];
const set_g2 = (x, y, v) => { _g2[x + y * 2] = v; }
const m = new Float32Array(B); // Ian Parberry's gradient magnitude table

// works in-place on v
const normalize2 = (v) => {
  let s = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  v[0] /= s;
  v[1] /= s;
}

// random float in range (-1, 1)
const randomflt = () => 2 * Math.random() - 1;

////////////////////////////////////
// initPerlin2D
(function() {
  // random gradient vectors
  for (let i = 0; i < B; i++) {
    const x = randomflt();
    const y = randomflt();
    // normalize
    let s = Math.sqrt(x * x + y * y);
    set_g2(i, 0, x / s);
    set_g2(i, 1, y / s);
  }

  // random permutations
  for (let i = 0; i < B; i++) {
    p[i] = i; // identity permutation
  }

  // randomly transpose
  for (let i = B - 1; i > 0; i--) {
    const newi = Math.floor(Math.random() * B);
    const temp = p[i];
    p[i] = p[newi];
    p[newi] = temp;
  }

  // gradient magnitude array
  let s = 1.0;
  for (let i = 0; i < B; i++) {
    m[i] = s;
    s /= g_fMu;
  }
})();
////////////////////////////////////

function noise2(vec) {
  let bx0, bx1, by0, by1;
  let rx0, rx1, ry0, ry1, q, t;

  // setup x
  t = vec[0] + N; bx0 = Math.floor(t) & BM;
  bx1 = (bx0 + 1) & BM; rx0 = t - Math.floor(t);
  rx1 = rx0 - 1;
  // setup y
  t = vec[1] + N; by0 = Math.floor(t) & BM;
  by1 = (by0 + 1) & BM; ry0 = t - Math.floor(t);
  ry1 = ry0 - 1;

  let b00 = p[(p[bx0] + by0) & BM];
  let b10 = p[(p[bx1] + by0) & BM];
  let b01 = p[(p[bx0] + by1) & BM];
  let b11 = p[(p[bx1] + by1) & BM];

  let sx = s_curve(rx0);

  let u, v;
  q = [get_g2(b00, 0), get_g2(b00, 1)]; u = m[b00] * at2(q, rx0, ry0);
  q = [get_g2(b10, 0), get_g2(b10, 1)]; v = m[b10] * at2(q, rx1, ry0);
  let a = lerp(sx, u, v);

  q = [get_g2(b01, 0), get_g2(b01, 1)]; u = m[b01] * at2(q, rx0, ry1);
  q = [get_g2(b11, 0), get_g2(b11, 1)]; v = m[b11] * at2(q, rx1, ry1);
  let b = lerp(sx, u, v);

  let sy = s_curve(ry0);
  return lerp(sy, a, b);
}

export default function PerlinNoise2D (x, y, n) {
  let sum = 0;
  let scale = 1;
  let p = [x, y];
  for (let i = 0; i < n; i++) { // for each octave
    scale *= 0.5; // apply persistence
    sum += noise2(p) * scale; // add octave of noise
    p[0] *= 2; p[1] *= 2; // apply lacunarity
  }
  return FM_SQRT2 * sum / (1 - scale);
}