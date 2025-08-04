const fs = require('node:fs');
const rays = fs.readFileSync(require('path').join(__dirname, 'inputs', `${require('path').basename(__filename, '.js').split('p')[0]}.txt`), 'utf8').split(/\r?\n/).map(line => line.split('@').map(line2 => line2.trim().split(',').map(Number)));

function intersect([[x1, y1, _z1], [vx1, vy1, _vz1]], [[x2, y2, _z2], [vx2, vy2, _vz2]]) {
  const det = vx1 * vy2 - vy1 * vx2;

  if (Math.abs(det) < 0) {
    return 0;
  }

  const t1 = ((x2 - x1) * vy2 - (y2 - y1) * vx2) / det;
  const t2 = ((x2 - x1) * vy1 - (y2 - y1) * vx1) / det;

  if (t1 < 0 || t2 < 0) {
    return 0;
  }

  const ix = x1 + t1 * vx1;
  const iy = y1 + t1 * vy1;

  if (ix < 200000000000000 || ix > 400000000000000 || iy < 200000000000000 || iy > 400000000000000) {
    return 0;
  }

  return 1;
}

let collisions = 0;
for (let i = 0; i < rays.length - 1; i++) {
  for (let j = i + 1; j < rays.length; j++) {
    collisions += intersect(rays[i], rays[j]);
  }
}

console.log(collisions);