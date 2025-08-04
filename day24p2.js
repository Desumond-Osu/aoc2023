const fs = require('node:fs');
const rays = fs.readFileSync(require('path').join(__dirname, 'inputs', `${require('path').basename(__filename, '.js').split('p')[0]}.txt`), 'utf8').split(/\r?\n/).map(line => line.split('@').map(line2 => line2.trim().split(',').map(BigInt)));

//helper
const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0]
];

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

const sub = (a, b) => a.map((x, i) => x - b[i]);
const add = (a, b) => a.map((x, i) => x + b[i]);
const mul = (v, s) => v.map(x => x * s);
const div = (v, s) => v.map(x => x / s);

//first 3 rays
const [[p0, v0], [p1, v1], [p2, v2]] = [rays[0], rays[1], rays[2]];

//some math including relative motion + vector algebra for line intersection
const P1 = sub(p1, p0);
const V1 = sub(v1, v0);
const P2 = sub(p2, p0);
const V2 = sub(v2, v0);

const P1xP2 = cross(P1, P2);
const V1xP2 = cross(V1, P2);
const P1xV2 = cross(P1, V2);

const numT1 = -(dot(P1xP2, V2));
const denomT1 = dot(V1xP2, V2);
const t1 = numT1 / denomT1;

const numT2 = -(dot(P1xP2, V1));
const denomT2 = dot(P1xV2, V1);
const t2 = numT2 / denomT2;

const c1 = add(p1, mul(v1, t1));
const c2 = add(p2, mul(v2, t2));

const vRock = div(sub(c2, c1), (t2 - t1));
const pRock = sub(c1, mul(vRock, t1));

console.log((Number)(pRock[0] + pRock[1] + pRock[2]));